package com.example.backend.Service;

import java.util.List;

import com.example.backend.Entity.Booking;
import com.example.backend.Entity.BookingDto;

public interface BookingService {
     Booking createBooking(BookingDto bookingDto,long movieId, int userId);
     Booking getBookingById(long bookingId);
     List<Booking> getAllBookings();
     void deleteBooking(long bookingId);
     List<Booking> findBookingsByUser(int userId);
     Booking updateBooking(long bookingId, BookingDto bookingDto);
}
