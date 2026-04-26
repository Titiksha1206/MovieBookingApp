package com.example.backend.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.Entity.Movie;
import com.example.backend.Entity.SeatCategory;
import com.example.backend.Entity.ShowTime;
import com.example.backend.Exception.MovieNotFoundException;
import com.example.backend.Exception.ShowtimeNotFoundException;
import com.example.backend.Repository.MovieRepo;
import com.example.backend.Repository.ShowtimeRepo;

@Service
public class ShowtimeServiceImpl implements ShowtimeService {

    private final ShowtimeRepo showtimeRepo;
    private final MovieRepo movieRepo;

    public ShowtimeServiceImpl(ShowtimeRepo showtimeRepo, MovieRepo movieRepo) {
        this.showtimeRepo = showtimeRepo;
         this.movieRepo    = movieRepo; 
    }

    @Override
    public ShowTime addShowtime(ShowTime showtime, long movieId) {
        Movie movie = movieRepo.findById(movieId)
                .orElseThrow(() -> new MovieNotFoundException(
                    "Movie not found with id: " + movieId));

        showtime.setMovie(movie);
        showtime.setAvailableSeats(showtime.getTotalSeats()); 

        if (showtime.getSeatCategories() != null) {
            for (SeatCategory cat : showtime.getSeatCategories()) {
                cat.setAvailableSeats(cat.getTotalSeats());
                cat.setShowtime(showtime);
            }
        }
        return showtimeRepo.save(showtime);
    }

    @Override
    public ShowTime updateShowtime(long showId, ShowTime showtime) {
        ShowTime existing = showtimeRepo.findById(showId)
            .orElseThrow(() -> new ShowtimeNotFoundException(
                "Showtime not found with id: " + showId));

        existing.setTheater(showtime.getTheater());
        existing.setShowDate(showtime.getShowDate());
        existing.setShowTime(showtime.getShowTime());
        existing.setTotalSeats(showtime.getTotalSeats());
        existing.setAvailableSeats(showtime.getTotalSeats());

        // ✅ Clear existing categories first (orphanRemoval will delete them)
        existing.getSeatCategories().clear();

        // ✅ Add new categories linked to existing showtime
        if (showtime.getSeatCategories() != null) {
            for (SeatCategory cat : showtime.getSeatCategories()) {
                cat.setAvailableSeats(cat.getTotalSeats());
                cat.setShowtime(existing);           // ✅ link to existing entity
                existing.getSeatCategories().add(cat); // ✅ add to existing collection
            }
        }

        return showtimeRepo.save(existing);
    }

    @Override
    public List<ShowTime> getAllShowtime() {
        return showtimeRepo.findAll();
    }

    @Override
    public ShowTime getShowtimeById(long showId) {
        return showtimeRepo.findById(showId)
                .orElseThrow(() -> new ShowtimeNotFoundException(
                    "Showtime not found with id: " + showId));
    }

    @Override
    public List<ShowTime> getShowtimesByDate(long movieId, String date) {
        return showtimeRepo.findByMovie_MovieIdAndShowDate(movieId, date);
    }

    @Override
    public List<ShowTime> getShowtimesByMovie(long movieId) {
        return showtimeRepo.findByMovie_MovieId(movieId);
    }

    @Override
    public boolean deleteShowtimeById(long showId) {
        if (!showtimeRepo.existsById(showId)) {
            throw new ShowtimeNotFoundException("Showtime not found with id: " + showId);
        }
        showtimeRepo.deleteById(showId);
        return true;
    }
}