package com.example.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.Entity.ShowTime;

@Repository
public interface ShowtimeRepo  extends JpaRepository<ShowTime, Long>{
    List<ShowTime> findByMovie_MovieId(long movieId);
    List<ShowTime> findByMovie_MovieIdAndShowDate(long movieId, String showDate);
    
} 