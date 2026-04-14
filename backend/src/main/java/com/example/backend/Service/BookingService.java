package com.example.backend.Service;

import java.util.List;

import com.example.backend.Entity.Booking;
import com.example.backend.Exception.BookingNotFoundException;

public interface BookingService {
     Booking createBooking(Booking booking,long movieId, int userId);
     Booking getBookingById(long bookingId) throws BookingNotFoundException;
     List<Booking> getAllBookings();
     boolean deleteBooking(long bookingId) throws BookingNotFoundException;
     List<Booking> fingBookingsByUser(int userId);
     Booking updateBooking(long bookingId, Booking booking);

}
