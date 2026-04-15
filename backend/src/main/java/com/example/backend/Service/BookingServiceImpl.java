package com.example.backend.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.Entity.Booking;
import com.example.backend.Entity.Movie;
import com.example.backend.Entity.User;
import com.example.backend.Exception.BookingNotFoundException;
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
    public Booking createBooking(Booking booking, long movieId,int userId){
        Movie movie = movieRepo.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(booking.getSeatCount() <= 0){
            throw new RuntimeException("Invalid seat count");
        }

        booking.setMovie(movie);
        booking.setUser(user);

        return bookingRepo.save(booking);
    }

    @Override
    public Booking updateBooking(long bookingId, Booking booking){

        Booking existing = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking Not Found"));

        if (booking.getSeatCount() <= 0) {
            throw new RuntimeException("Invalid seat count");
        }

        existing.setSeatCount(booking.getSeatCount());
        existing.setTotalCost(booking.getTotalCost());

        return bookingRepo.save(existing);
    }

    @Override
    public Booking getBookingById(long bookingId){
        return bookingRepo.findById(bookingId).orElseThrow(() -> new BookingNotFoundException("Booking Not Found"));
    }

    @Override
    public List<Booking> getAllBookings(){
        return bookingRepo.findAll();
    }

    @Override
    public void deleteBooking(long bookingId){
      if (!bookingRepo.existsById(bookingId)) {
        throw new BookingNotFoundException("Booking Not Found");
    }

        bookingRepo.deleteById(bookingId);
    }
    
    @Override
    public List<Booking> findBookingsByUser(int userId){
        if (!userRepo.existsById(userId)){
            throw new RuntimeException("User not found");
        }

        return bookingRepo.findBookingsByUser(userId);
    }
}
