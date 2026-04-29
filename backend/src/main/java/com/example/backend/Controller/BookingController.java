package com.example.backend.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
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
import com.example.backend.Entity.BookingDto;
import com.example.backend.Service.BookingService;
import com.example.backend.Service.MovieService;

//  @RestController👉 Combines: @Controller and @ResponseBody
// 👉 Means: All methods return JSON response directly
@RestController

// 👉 Base URL for all APIs
@RequestMapping("/api/booking")
public class BookingController {
    // 👉 Spring automatically injects service objects(DI)
    private final BookingService bookingService;
    private final MovieService movieService;

    public BookingController(BookingService bookingService, MovieService movieService) {
        this.bookingService = bookingService;
        this.movieService = movieService;
    }

    // @PostMapping👉 Handles HTTP POST
    // {movieId}/{userId}👉 Path variables: [/api/booking/1/5]
    // @RequestBody👉 Request body contains JSON of Booking object
    @PostMapping("/{movieId}/{userId}")
    public ResponseEntity<Booking> addBooking(@RequestBody BookingDto bookingDto, @PathVariable long movieId,
            @PathVariable int userId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingService.createBooking(bookingDto, movieId, userId));
    }

    @PutMapping("/{bookingId}")
    public ResponseEntity<Booking> updateBooking(@PathVariable long bookingId, @RequestBody BookingDto bookingDto) {
        return ResponseEntity.ok(bookingService.updateBooking(bookingId, bookingDto));
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<Booking> getBookingById(@PathVariable long bookingId) {
        return ResponseEntity.ok(bookingService.getBookingById(bookingId));
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<String> deleteBookingById(@PathVariable long bookingId) {
        bookingService.deleteBooking(bookingId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Booking>> getBookingsByMovieId(@PathVariable long movieId) {
        return ResponseEntity.ok(movieService.findAllBookingsByMovie(movieId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUser(@PathVariable long userId) {
        return ResponseEntity.ok(bookingService.findBookingsByUser(userId));
    }

}

// Flow:
// Request comes from frontend
// Controller receives booking data
// Calls service
// Returns saved booking