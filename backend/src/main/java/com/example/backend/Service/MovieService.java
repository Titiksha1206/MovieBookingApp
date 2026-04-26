package com.example.backend.Service;

import java.util.List;

import com.example.backend.Entity.Booking;
import com.example.backend.Entity.Movie;
import com.example.backend.Entity.MovieDto;

public interface MovieService {
    Movie addMovie(MovieDto dto);
    Movie updateMovie(long movieId, MovieDto movie);
    List<Movie> getAllMovies();
    Movie getMovieById(long movieId);
    boolean deleteMovieById(long movieId);
    List<Booking> findAllBookingsByMovie(long movieId);
}
