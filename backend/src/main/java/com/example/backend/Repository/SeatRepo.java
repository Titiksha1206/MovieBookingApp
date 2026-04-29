package com.example.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.backend.Entity.Seat;

import jakarta.persistence.LockModeType;

@Repository
public interface SeatRepo extends JpaRepository<Seat, Long> {
     List<Seat> findByCategory_CategoryId(long categoryId);
     List<Seat> findByCategory_Showtime_ShowtimeId(Long showtimeId);
     @Lock(LockModeType.PESSIMISTIC_WRITE)
     @Query("SELECT s FROM Seat s WHERE s.seatId IN :ids")
     List<Seat> findAllByIdWithLock(@Param("ids") List<Long> ids);
}
