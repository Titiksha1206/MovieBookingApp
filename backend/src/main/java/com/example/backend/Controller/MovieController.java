package com.example.backend.Controller;

import java.util.List;

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
import com.example.backend.Entity.MovieDto;
import com.example.backend.Service.MovieService;

@RestController
@RequestMapping("/api/movie")
public class MovieController {
    private MovieService movieService;

    public MovieController(MovieService movieService){
        this.movieService = movieService;
    }
    
    @PostMapping
    public ResponseEntity<Movie> addMovie(@RequestBody MovieDto dto){
        return ResponseEntity.status(201).body(movieService.addMovie(dto));
    }

    @PutMapping("/{movieId}")
    public ResponseEntity<Movie> updateMovie(@PathVariable long movieId, @RequestBody MovieDto dto){
        return ResponseEntity.ok(movieService.updateMovie(movieId, dto));
    }

    @GetMapping("/{movieId}")
    public ResponseEntity<Movie> getMovieById(@PathVariable long movieId){
        return ResponseEntity.ok(movieService.getMovieById(movieId));
    }

    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies(){
        return ResponseEntity.ok(movieService.getAllMovies());
    }

    @DeleteMapping("/{movieId}")
    public ResponseEntity<Void> deleteMovieById(@PathVariable long movieId){
        movieService.deleteMovieById(movieId);
        return ResponseEntity.noContent().build();
    }

}
