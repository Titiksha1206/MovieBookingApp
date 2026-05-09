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

    // ✅ Check if movie has any upcoming/ongoing bookings (showDate >= today)
    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END " +
            "FROM Booking b " +
            "WHERE b.movie.movieId = :movieId " +
            "AND b.showtime.showDate >= :today")
    boolean existsUpcomingBookingForMovie(@Param("movieId") long movieId, @Param("today") String today);

    // ✅ Count upcoming bookings for a movie (useful for error message)
    @Query("SELECT COUNT(b) FROM Booking b " +
            "WHERE b.movie.movieId = :movieId " +
            "AND b.showtime.showDate >= :today")
    long countUpcomingBookingsForMovie(@Param("movieId") long movieId, @Param("today") String today);

    long countByMovie_MovieId(long movieId);
     // ✅ Count bookings for a showtime (to prevent deletion/update when bookings exist)
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.showtime.showtimeId = :showtimeId")
    long countByShowtime_ShowtimeId(@Param("showtimeId") Long showtimeId);
}
