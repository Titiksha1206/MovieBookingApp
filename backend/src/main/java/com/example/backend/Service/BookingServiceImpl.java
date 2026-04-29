package com.example.backend.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.Entity.Booking;
import com.example.backend.Entity.BookingDto;
import com.example.backend.Entity.Movie;
import com.example.backend.Entity.Seat;
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
import com.example.backend.Repository.SeatRepo;
import com.example.backend.Repository.ShowtimeRepo;
import com.example.backend.Repository.UserRepo;

import org.springframework.transaction.annotation.Transactional;

// ✅ @Service: Indicates that this class is a service component in the Spring context.
// 👉 Marks this as service layer (business logic)
// 👉 Spring will manage it as a bean
@Service
@Transactional // ✅ Important for handling multiple DB operations atomically
public class BookingServiceImpl implements BookingService {

    private final BookingRepo bookingRepo;
    private final MovieRepo movieRepo;
    private final UserRepo userRepo;
    private final SeatRepo seatRepo;
    private final ShowtimeRepo showtimeRepo;

    public BookingServiceImpl(BookingRepo bookingRepo, MovieRepo movieRepo, UserRepo userRepo, SeatRepo seatRepo,
            ShowtimeRepo showtimeRepo) {
        this.bookingRepo = bookingRepo;
        this.movieRepo = movieRepo;
        this.userRepo = userRepo;
        this.seatRepo = seatRepo;
        this.showtimeRepo = showtimeRepo;
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

        // List<Seat> seats = seatRepo.findAllById(bookingDto.getSeatIds());
        List<Seat> seats = seatRepo.findAllByIdWithLock(bookingDto.getSeatIds());

        if (seats.size() != bookingDto.getSeatIds().size()) {
            throw new RuntimeException("Some seat IDs are invalid.");
        }

        // 3. 🔍 Check each seat – is it already booked for this showtime?
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

        Booking booking = new Booking();
        booking.setSeatCount(seats.size());
        booking.setTotalCost(bookingDto.getTotalCost());
        booking.setMovie(movie);
        booking.setUser(user);
        booking.setShowtime(showtime); // ✅ link to showtime
        booking.setSeats(seats);
        booking.setStatus("CONFIRMED");

        // ✅ SAVE FIRST
        // booking = bookingRepo.save(booking);

        // ✅ SET RELATION
        // booking.getSeats().addAll(seats);

        // ✅ UPDATE SEAT STATUS
        for (Seat seat : seats) {
            seat.setStatus("BOOKED");
        }
        seatRepo.saveAll(seats);

        return bookingRepo.save(booking);
    }

    @Override
    public Booking updateBooking(long bookingId, BookingDto bookingDto) {

        Booking existing = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking Not Found with id: " + bookingId));

        if (bookingDto.getSeatCount() <= 0) {
            throw new InsufficientSeatCountException("Invalid seat count");
        }

        // 3. If seatIds are provided, update the seat list
        if (bookingDto.getSeatIds() != null && !bookingDto.getSeatIds().isEmpty()) {
            // 3a. Validate showtime (from existing booking)
            Long showtimeId = existing.getShowtime().getShowtimeId();

            // 3b. Lock and fetch new seats
            List<Seat> newSeats = seatRepo.findAllByIdWithLock(bookingDto.getSeatIds());

            if (newSeats.size() != bookingDto.getSeatIds().size()) {
                throw new IllegalArgumentException("Some seat IDs are invalid.");
            }

            // 3c. Check each new seat is AVAILABLE and not already booked in another active
            // booking (excluding this booking)
            for (Seat seat : newSeats) {
                if (!"AVAILABLE".equals(seat.getStatus())) {
                    throw new SeatAlreadyBookedException(
                            "Seat " + seat.getRowLabel() + seat.getSeatNumber() + " is not available.");
                }
                boolean alreadyBooked = bookingRepo.existsActiveBookingForSeatAndShowtime(seat.getSeatId(), showtimeId);
                // Exclude current booking ID from the check? The query already counts all
                // bookings with status != CANCELLED.
                // If this seat is already in this same booking (but the bookingDto includes
                // same seatIds), we should skip.
                // But since we are comparing with existing seats later, we need to allow the
                // seat if it's already in this booking.
                // Simpler: check if the seat is occupied by any other active booking (different
                // bookingId)
                if (alreadyBooked) {
                    // Check if the existing booking already has this seat
                    boolean alreadyHasSeat = existing.getSeats().stream()
                            .anyMatch(s -> s.getSeatId().equals(seat.getSeatId()));
                    if (!alreadyHasSeat) {
                        throw new SeatAlreadyBookedException("Seat " + seat.getRowLabel() + seat.getSeatNumber()
                                + " is already taken by another booking.");
                    }
                }
            }

            // 3d. Release old seats (set AVAILABLE)
            List<Seat> oldSeats = existing.getSeats();
            for (Seat seat : oldSeats) {
                seat.setStatus("AVAILABLE");
            }
            seatRepo.saveAll(oldSeats);

            // 3e. Set new seats as BOOKED
            for (Seat seat : newSeats) {
                seat.setStatus("BOOKED");
            }
            seatRepo.saveAll(newSeats);

            // 3f. Update the booking's seat list
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

        // ✅ Step 1: Fetch booking
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(
                        "Booking Not Found with id: " + bookingId));

        // ✅ Step 2: Get seats
        List<Seat> seats = booking.getSeats();

        // ✅ Step 3: Update seat status → AVAILABLE
        for (Seat seat : seats) {
            seat.setStatus("AVAILABLE");
        }

        // ✅ Step 4: Save updated seats
        seatRepo.saveAll(seats);

        // ✅ Step 5: Remove relation (important for clean DB)
        booking.getSeats().clear();

        // ✅ Step 6: Delete booking
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
