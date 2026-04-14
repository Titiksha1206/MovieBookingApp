package com.example.backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Entity.Booking;
import com.example.backend.Exception.BookingNotFoundException;
import com.example.backend.Service.BookingService;
import com.example.backend.Service.MovieService;

@RestController
@RequestMapping("/api/booking")
public class BookingController {
     @Autowired
    BookingService bookingService;

    @Autowired
    MovieService movieService;
    
   
    @PostMapping("/{movieId}/{userId}")
    public ResponseEntity<Booking> addBooking(@RequestBody Booking booking , @PathVariable long movieId, @PathVariable int userId){
        return ResponseEntity.status(201).body(bookingService.createBooking(booking,movieId,userId));
    }

   

    @PutMapping("/{bookingId}")
    public ResponseEntity<Booking> updateBooking(@PathVariable long bookingId, @RequestBody Booking booking) {
        return ResponseEntity.status(201).body(bookingService.updateBooking(bookingId, booking));
    }

    
    @GetMapping("/{bookingId}")
    public Booking getBookingById(@PathVariable long bookingId) throws BookingNotFoundException{
        return bookingService.getBookingById(bookingId);
    }

    @GetMapping
    public List<Booking> getAllBooings() {
        return bookingService.getAllBookings();
    }

    @DeleteMapping("/{bookingId}")
    public boolean deleteBookingById(@PathVariable long bookingId) throws BookingNotFoundException{
        return bookingService.deleteBooking(bookingId);
    }

    
    @GetMapping("/movie/{movieId}")
    public List<Booking> getBookinsByMovieId(@PathVariable long movieId){
        return movieService.findAllBookingsByMovie(movieId);
    }
    

    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUser(@PathVariable int userId){
        return bookingService.fingBookingsByUser(userId);
    }
    
}
