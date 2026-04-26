package com.example.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.Entity.SeatCategory;

@Repository
public interface SeatCategoryRepo extends JpaRepository<SeatCategory, Long> {
    List<SeatCategory> findByShowtime_ShowtimeId(long showtimeId);
}
