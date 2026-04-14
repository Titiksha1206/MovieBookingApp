package com.example.backend.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.Entity.Booking;
import com.example.backend.Entity.Movie;
import com.example.backend.Entity.User;
import com.example.backend.Exception.BookingNotFoundException;
import com.example.backend.Repository.BookingRepo;
import com.example.backend.Repository.MovieRepo;
import com.example.backend.Repository.UserRepo;

@Service
public class BookingServiceImpl implements BookingService {
     @Autowired
     BookingRepo bookingRepo;
     @Autowired
     MovieRepo movieRepo;
    @Autowired
    UserRepo userRepo;

    @Override
    public Booking createBooking(Booking booking, long movieId,int userId) {
        Movie movie = null;
        User user = null;

        if(userRepo.existsById(userId) && movieRepo.existsById(movieId))
        {
             user = userRepo.findById(userId).orElse(null);
             movie = movieRepo.findById(movieId).orElse(null);
        }
        if(movie != null  && user != null)
        {
            booking.setUser(user);
            booking.setMovie(movie);
        }
       return bookingRepo.save(booking);
    }
    @Override
    public Booking updateBooking(long bookingId, Booking booking) {
         booking.setBookingId(bookingId);
         return bookingRepo.save(booking);
    }
    @Override
    public Booking getBookingById(long bookingId) throws BookingNotFoundException {
        return bookingRepo.findById(bookingId).orElseThrow(() -> new BookingNotFoundException("Booking Not Found"));
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }

    @Override
    public boolean deleteBooking(long bookingId) throws BookingNotFoundException {
       if(!bookingRepo.existsById(bookingId)) throw new BookingNotFoundException("Booking Not Found");
       bookingRepo.deleteById(bookingId);
       return true;
    }
    @Override
    public List<Booking> fingBookingsByUser(int userId) {
        return bookingRepo.findBookingsByUser(userId);
    }

    


}
