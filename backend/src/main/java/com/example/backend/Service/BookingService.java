package com.example.backend.Service;

import java.util.List;

import com.example.backend.Entity.Booking;


public interface BookingService {
     Booking createBooking(Booking booking,long movieId, int userId);
     Booking getBookingById(long bookingId);
     List<Booking> getAllBookings();
     void deleteBooking(long bookingId);
     List<Booking> findBookingsByUser(int userId);
     Booking updateBooking(long bookingId, Booking booking);

}
