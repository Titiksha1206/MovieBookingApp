package com.example.backend.Service;

import java.util.List;

import com.example.backend.Entity.ShowTime;

public interface ShowtimeService {
    ShowTime addShowtime(ShowTime showtime, long movieId);
    ShowTime updateShowtime(long showId, ShowTime showtime);
    List<ShowTime> getAllShowtime();
    ShowTime getShowtimeById(long showId);
    List<ShowTime> getShowtimesByDate(long movieId, String date);
    boolean deleteShowtimeById(long showId);
    List<ShowTime> getShowtimesByMovie(long movieId);
}