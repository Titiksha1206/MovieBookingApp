package com.example.backend.Controller;

import java.util.List;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Entity.Movie;
import com.example.backend.Service.MovieService;

@RestController
@RequestMapping("/api/movie")
public class MovieController {
      private MovieService movieService;

    public MovieController(MovieService movieService){
        this.movieService = movieService;
    }
    
    @PostMapping
    public ResponseEntity<Movie> addMovie(@RequestBody Movie movie){
        Movie m =  movieService.addMovie(movie);
        if(m != null)
          return ResponseEntity.status(200).body(m);
        else
         return new ResponseEntity<>(HttpStatusCode.valueOf(500));
    }

    @PutMapping("/{movieId}")
    public ResponseEntity<Movie> updateMovie(@PathVariable long movieId, @RequestBody Movie movie){
        Movie m =  movieService.updateMovie(movieId, movie);
        if(m != null)
          return ResponseEntity.status(200).body(m);
        else
         return new ResponseEntity<>(HttpStatusCode.valueOf(500));
    }

    @GetMapping("/{movieId}")
    public ResponseEntity<Movie> getMovieById(@PathVariable long movieId){
        
        Movie movie = movieService.getMovieById(movieId);
        if(movie != null){
           return ResponseEntity.status(200).body(movie);
        }
        else {
            return new ResponseEntity<>(HttpStatusCode.valueOf(404));
        }
    }

    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies(){
        
        List<Movie> movies = movieService.getAllMovies();
        if(!movies.isEmpty()){
           return ResponseEntity.status(200).body(movies);
        }
        else {
            return new ResponseEntity<>(HttpStatusCode.valueOf(404));
        }
    }

    

    @DeleteMapping("/{movieId}")
    public ResponseEntity<Boolean> deleteMovieById(@PathVariable long movieId){
        return ResponseEntity.status(200).body(movieService.deleteMovieById(movieId));
    }

}
