package com.example.backend.Service;

import java.util.List;

import com.example.backend.Entity.Booking;
import com.example.backend.Entity.Movie;
import com.example.backend.Entity.MovieDto;

public interface MovieService {
    public Movie addMovie(Movie movie);
     public Movie updateMovie(long movieId, MovieDto movie);
     public List<Movie> getAllMovies();
     public Movie getMovieById(long movieId);
     public boolean deleteMovieById(long movieId);
     List<Booking> findAllBookingsByMovie(long movieId);

}
