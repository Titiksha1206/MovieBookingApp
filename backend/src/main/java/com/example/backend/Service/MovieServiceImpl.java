package com.example.backend.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.Entity.Booking;
import com.example.backend.Entity.Movie;
import com.example.backend.Repository.MovieRepo;

@Service
public class MovieServiceImpl implements MovieService {
     @Autowired
    MovieRepo repo;
    
     public Movie addMovie(Movie movie){
        return repo.save(movie);
     }

     public Movie updateMovie(long movieId, Movie movie){
        try {
            movie.setMovieId(movieId);
            return repo.save(movie);
           } catch(Exception e){
               e.printStackTrace();
           }
           return null;
     }

     public List<Movie> getAllMovies(){
        return repo.findAll();
     }

     public Movie getMovieById(long movieId){
        return repo.findById(movieId).orElse(null);
     }

     public boolean deleteMovieById(long movieId){
        try {
            repo.deleteById(movieId);
            return true;
           } catch(Exception e){
               e.printStackTrace();
           }
           return false;
     }

     @Override
    public List<Booking> findAllBookingsByMovie(long movieId) {
        Movie movie = repo.findById(movieId).orElse(null);
        if(movie != null){
            return movie.getBookings();
        }
        else {
            return new ArrayList<Booking>();
        }
    }

}
