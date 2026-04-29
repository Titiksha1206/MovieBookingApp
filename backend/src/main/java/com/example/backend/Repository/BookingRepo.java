package com.example.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.backend.Entity.Booking;

@Repository
public interface BookingRepo extends JpaRepository<Booking, Long> {
     @Query("Select b from Booking b where b.user.userId = :userId")
     List<Booking> findBookingsByUser(@Param("userId") long userId);
     @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END " +
       "FROM Booking b JOIN b.seats s " +
       "WHERE s.id = :seatId AND b.showtime.id = :showtimeId AND b.status != 'CANCELLED'")
     boolean existsActiveBookingForSeatAndShowtime(@Param("seatId") Long seatId, @Param("showtimeId") Long showtimeId);
}
