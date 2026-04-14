package com.example.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.backend.Entity.Booking;

@Repository
public interface BookingRepo extends JpaRepository<Booking, Long> {
     @Query("from Booking b where b.user.userId = :userId")
     List<Booking> findBookingsByUser(int userId);
}
