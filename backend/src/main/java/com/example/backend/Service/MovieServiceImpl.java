package com.example.backend.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.Entity.Booking;
import com.example.backend.Entity.Movie;
import com.example.backend.Entity.MovieDto;
import com.example.backend.Exception.MovieNotFoundException;
import com.example.backend.Repository.MovieRepo;

@Service
public class MovieServiceImpl implements MovieService {
   
    MovieRepo repo;

    public MovieServiceImpl(MovieRepo repo){
        this.repo = repo;
    }
    
    @Override
    public Movie addMovie(MovieDto dto){
        Movie movie = new Movie();
        movie.setTitle(dto.getTitle());
        movie.setGenre(dto.getGenre());
        movie.setDuration(dto.getDuration());
        movie.setPrice(dto.getPrice());
        movie.setLanguage(dto.getLanguage());
        movie.setCbfc(dto.getCbfc());
        movie.setImageUrl(dto.getImageUrl()); 
        return repo.save(movie);
    }

    @Override
    public Movie updateMovie(long movieId, MovieDto movie){
        Movie existing = repo.findById(movieId)
                .orElseThrow(() -> new MovieNotFoundException("Movie not found with id: " + movieId));

        existing.setTitle(movie.getTitle());
        existing.setDuration(movie.getDuration());
        existing.setGenre(movie.getGenre());
        existing.setPrice(movie.getPrice());
        existing.setLanguage(movie.getLanguage());
        existing.setCbfc(movie.getCbfc()); 
        existing.setImageUrl(movie.getImageUrl());        

        return repo.save(existing);
    }

    @Override
    public List<Movie> getAllMovies(){
        return repo.findAll();
    }

    @Override
    public Movie getMovieById(long movieId){
        return repo.findById(movieId)
            .orElseThrow(() -> new MovieNotFoundException("Movie not found with id: " + movieId));
    }

    @Override
    public boolean deleteMovieById(long movieId){
        if(!repo.existsById(movieId)){
            throw new MovieNotFoundException("Movie not found with id: " + movieId);
        }
        repo.deleteById(movieId);
        return true;
    }

    @Override
    public List<Booking> findAllBookingsByMovie(long movieId){
       Movie movie = repo.findById(movieId)
                .orElseThrow(() -> new MovieNotFoundException("Movie not found with id: " + movieId));

        return movie.getBookings();
    }

}
