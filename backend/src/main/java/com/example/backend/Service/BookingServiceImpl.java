package com.example.backend.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.Entity.Booking;
import com.example.backend.Entity.BookingDto;
import com.example.backend.Entity.Movie;
import com.example.backend.Entity.User;
import com.example.backend.Exception.BookingNotFoundException;
import com.example.backend.Exception.InsufficientSeatCountException;
import com.example.backend.Exception.MovieNotFoundException;
import com.example.backend.Exception.UserNotFoundException;
import com.example.backend.Repository.BookingRepo;
import com.example.backend.Repository.MovieRepo;
import com.example.backend.Repository.UserRepo;

// ✅ @Service: Indicates that this class is a service component in the Spring context.
// 👉 Marks this as service layer (business logic)
// 👉 Spring will manage it as a bean
@Service
public class BookingServiceImpl implements BookingService {
    
    private final BookingRepo bookingRepo;
    private final MovieRepo movieRepo;
    private final UserRepo userRepo;

    public BookingServiceImpl(BookingRepo bookingRepo, MovieRepo movieRepo, UserRepo userRepo){
        this.bookingRepo = bookingRepo;
        this.movieRepo = movieRepo;
        this.userRepo = userRepo;
    }

    @Override
    public Booking createBooking(BookingDto bookingDto, long movieId,int userId){
        Movie movie = movieRepo.findById(movieId)
                .orElseThrow(() -> new MovieNotFoundException("Movie not found with id: " + movieId));

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        if(bookingDto.getSeatCount() <= 0){
            throw new InsufficientSeatCountException("Invalid seat count");
        }

        Booking booking = new Booking();
        booking.setSeatCount(bookingDto.getSeatCount());
        booking.setTotalCost(bookingDto.getTotalCost());
        booking.setMovie(movie);
        booking.setUser(user);

        return bookingRepo.save(booking);
    }

    @Override
    public Booking updateBooking(long bookingId, BookingDto bookingDto){

        Booking existing = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking Not Found with id: " + bookingId));

        if (bookingDto.getSeatCount() <= 0) {
            throw new InsufficientSeatCountException("Invalid seat count");
        }

        existing.setSeatCount(bookingDto.getSeatCount());
        existing.setTotalCost(bookingDto.getTotalCost());

        return bookingRepo.save(existing);
    }

    @Override
    public Booking getBookingById(long bookingId){
        return bookingRepo.findById(bookingId).orElseThrow(() -> new BookingNotFoundException("Booking Not Found with id: " + bookingId));
    }

    @Override
    public List<Booking> getAllBookings(){
        return bookingRepo.findAll();
    }

    @Override
    public void deleteBooking(long bookingId){
      if (!bookingRepo.existsById(bookingId)) {
        throw new BookingNotFoundException("Booking Not Found with id: " + bookingId);
    }

        bookingRepo.deleteById(bookingId);
    }
    
    @Override
    public List<Booking> findBookingsByUser(int userId){
        if (!userRepo.existsById(userId)){
            throw new UserNotFoundException("User not found with id: " + userId);
        }

        return bookingRepo.findBookingsByUser(userId);
    }
}
