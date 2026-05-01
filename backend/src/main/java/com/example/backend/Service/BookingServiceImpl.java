package com.example.backend.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.Entity.Booking;
import com.example.backend.Entity.BookingDto;
import com.example.backend.Entity.Movie;
import com.example.backend.Entity.Seat;
import com.example.backend.Entity.SeatCategory;
import com.example.backend.Entity.ShowTime;
import com.example.backend.Entity.User;
import com.example.backend.Exception.BookingNotFoundException;
import com.example.backend.Exception.InsufficientSeatCountException;
import com.example.backend.Exception.MovieNotFoundException;
import com.example.backend.Exception.SeatAlreadyBookedException;
import com.example.backend.Exception.ShowtimeNotFoundException;
import com.example.backend.Exception.UserNotFoundException;
import com.example.backend.Repository.BookingRepo;
import com.example.backend.Repository.MovieRepo;
import com.example.backend.Repository.SeatCategoryRepo;
import com.example.backend.Repository.SeatRepo;
import com.example.backend.Repository.ShowtimeRepo;
import com.example.backend.Repository.UserRepo;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepo bookingRepo;
    private final MovieRepo movieRepo;
    private final UserRepo userRepo;
    private final SeatRepo seatRepo;
    private final ShowtimeRepo showtimeRepo;
    private final SeatCategoryRepo seatCategoryRepo; // 👈 NEW

    public BookingServiceImpl(BookingRepo bookingRepo, MovieRepo movieRepo, 
                              UserRepo userRepo, SeatRepo seatRepo,
                              ShowtimeRepo showtimeRepo, SeatCategoryRepo seatCategoryRepo) {
        this.bookingRepo = bookingRepo;
        this.movieRepo = movieRepo;
        this.userRepo = userRepo;
        this.seatRepo = seatRepo;
        this.showtimeRepo = showtimeRepo;
        this.seatCategoryRepo = seatCategoryRepo;
    }

    @Override
    public Booking createBooking(BookingDto bookingDto, long movieId, long userId) {

        Movie movie = movieRepo.findById(movieId)
                .orElseThrow(() -> new MovieNotFoundException("Movie not found"));

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        ShowTime showtime = showtimeRepo.findById(bookingDto.getShowtimeId())
                .orElseThrow(() -> new ShowtimeNotFoundException("Showtime not found"));

        if (bookingDto.getSeatIds() == null || bookingDto.getSeatIds().isEmpty()) {
            throw new RuntimeException("Seat IDs are missing");
        }

        List<Seat> seats = seatRepo.findAllByIdWithLock(bookingDto.getSeatIds());

        if (seats.size() != bookingDto.getSeatIds().size()) {
            throw new RuntimeException("Some seat IDs are invalid.");
        }

        // Check each seat for existing active booking
        for (Seat seat : seats) {
            boolean alreadyBooked = bookingRepo.existsActiveBookingForSeatAndShowtime(
                    seat.getSeatId(), bookingDto.getShowtimeId());
            if (alreadyBooked) {
                throw new SeatAlreadyBookedException(
                        "Seat " + seat.getSeatNumber() + " is already taken for this show");
            }
        }

        for (Seat seat : seats) {
            if (!"AVAILABLE".equals(seat.getStatus())) {
                throw new SeatAlreadyBookedException("Seat " + seat.getSeatId() + " not available");
            }
        }

        // Create booking
        Booking booking = new Booking();
        booking.setSeatCount(seats.size());
        booking.setTotalCost(bookingDto.getTotalCost());
        booking.setMovie(movie);
        booking.setUser(user);
        booking.setShowtime(showtime);
        booking.setSeats(seats);
        booking.setStatus("CONFIRMED");

        // Mark seats as BOOKED
        for (Seat seat : seats) {
            seat.setStatus("BOOKED");
        }
        seatRepo.saveAll(seats);

        // 👇 NEW: Decrement available seats in each SeatCategory
        for (Seat seat : seats) {
            SeatCategory category = seat.getCategory();
            if (category != null) {
                category.setAvailableSeats(category.getAvailableSeats() - 1);
                seatCategoryRepo.save(category);
            }
        }

        // 👇 NEW: Decrement available seats in ShowTime
        showtime.setAvailableSeats(showtime.getAvailableSeats() - seats.size());
        showtimeRepo.save(showtime);

        return bookingRepo.save(booking);
    }

    @Override
    public Booking updateBooking(long bookingId, BookingDto bookingDto) {
        Booking existing = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking Not Found with id: " + bookingId));

        if (bookingDto.getSeatCount() <= 0) {
            throw new InsufficientSeatCountException("Invalid seat count");
        }

        // If seatIds are provided, update the seat list
        if (bookingDto.getSeatIds() != null && !bookingDto.getSeatIds().isEmpty()) {
            Long showtimeId = existing.getShowtime().getShowtimeId();
            List<Seat> newSeats = seatRepo.findAllByIdWithLock(bookingDto.getSeatIds());

            if (newSeats.size() != bookingDto.getSeatIds().size()) {
                throw new IllegalArgumentException("Some seat IDs are invalid.");
            }

            // Check new seats availability
            for (Seat seat : newSeats) {
                if (!"AVAILABLE".equals(seat.getStatus())) {
                    throw new SeatAlreadyBookedException(
                            "Seat " + seat.getRowLabel() + seat.getSeatNumber() + " is not available.");
                }
                boolean alreadyBooked = bookingRepo.existsActiveBookingForSeatAndShowtime(seat.getSeatId(), showtimeId);
                if (alreadyBooked) {
                    boolean alreadyHasSeat = existing.getSeats().stream()
                            .anyMatch(s -> s.getSeatId().equals(seat.getSeatId()));
                    if (!alreadyHasSeat) {
                        throw new SeatAlreadyBookedException("Seat " + seat.getRowLabel() + seat.getSeatNumber()
                                + " is already taken by another booking.");
                    }
                }
            }

            // Release old seats (status AVAILABLE) and update category/showtime counters
            List<Seat> oldSeats = existing.getSeats();
            for (Seat seat : oldSeats) {
                seat.setStatus("AVAILABLE");
                // Increase category available seats
                SeatCategory category = seat.getCategory();
                if (category != null) {
                    category.setAvailableSeats(category.getAvailableSeats() + 1);
                    seatCategoryRepo.save(category);
                }
            }
            seatRepo.saveAll(oldSeats);
            // Increase showtime available seats
            ShowTime showtime = existing.getShowtime();
            showtime.setAvailableSeats(showtime.getAvailableSeats() + oldSeats.size());
            showtimeRepo.save(showtime);

            // Book new seats
            for (Seat seat : newSeats) {
                seat.setStatus("BOOKED");
                // Decrease category available seats
                SeatCategory category = seat.getCategory();
                if (category != null) {
                    category.setAvailableSeats(category.getAvailableSeats() - 1);
                    seatCategoryRepo.save(category);
                }
            }
            seatRepo.saveAll(newSeats);
            // Decrease showtime available seats
            showtime.setAvailableSeats(showtime.getAvailableSeats() - newSeats.size());
            showtimeRepo.save(showtime);

            existing.setSeats(newSeats);
        }

        existing.setSeatCount(bookingDto.getSeatCount());
        existing.setTotalCost(bookingDto.getTotalCost());

        return bookingRepo.save(existing);
    }

    @Override
    public Booking getBookingById(long bookingId) {
        return bookingRepo.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking Not Found with id: " + bookingId));
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }

    @Override
    public void deleteBooking(long bookingId) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking Not Found with id: " + bookingId));

        List<Seat> seats = booking.getSeats();

        // Release seats (status AVAILABLE) and update category & showtime counters
        ShowTime showtime = booking.getShowtime();
        for (Seat seat : seats) {
            seat.setStatus("AVAILABLE");
            SeatCategory category = seat.getCategory();
            if (category != null) {
                category.setAvailableSeats(category.getAvailableSeats() + 1);
                seatCategoryRepo.save(category);
            }
        }
        seatRepo.saveAll(seats);

        // Increase showtime available seats
        if (showtime != null) {
            showtime.setAvailableSeats(showtime.getAvailableSeats() + seats.size());
            showtimeRepo.save(showtime);
        }

        // Remove relation and delete booking
        booking.getSeats().clear();
        bookingRepo.delete(booking);
        bookingRepo.flush();
    }

    @Override
    public List<Booking> findBookingsByUser(long userId) {
        if (!userRepo.existsById(userId)) {
            throw new UserNotFoundException("User not found with id: " + userId);
        }
        return bookingRepo.findBookingsByUser(userId);
    }
}