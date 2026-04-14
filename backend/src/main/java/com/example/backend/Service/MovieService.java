package com.example.backend.Service;

import java.util.List;

import com.example.backend.Entity.Booking;
import com.example.backend.Entity.Movie;

public interface MovieService {
    public Movie addMovie(Movie movie);
     public Movie updateMovie(long movieId, Movie movie);
     public List<Movie> getAllMovies();
     public Movie getMovieById(long movieId);
     public boolean deleteMovieById(long movieId);
     List<Booking> findAllBookingsByMovie(long movieId);

}
