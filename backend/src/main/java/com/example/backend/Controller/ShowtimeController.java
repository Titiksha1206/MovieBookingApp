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

import com.example.backend.Entity.ShowTime;
import com.example.backend.Service.ShowtimeService;

@RestController
@RequestMapping("/api/showtime")
public class ShowtimeController {
    private final ShowtimeService showtimeService;

    public ShowtimeController(ShowtimeService showtimeService) {
        this.showtimeService = showtimeService;
    }

    @PostMapping("/{movieId}")
    public ResponseEntity<ShowTime> addShowtime(@RequestBody ShowTime showtime, @PathVariable long movieId) {
        return ResponseEntity.status(201).body(showtimeService.addShowtime(showtime, movieId));
    }

    @PutMapping("/{showId}")
    public ResponseEntity<ShowTime> updateShowtime(@PathVariable long showId, @RequestBody ShowTime showtime) {
        return ResponseEntity.ok(showtimeService.updateShowtime(showId, showtime));
    }

    @GetMapping
    public ResponseEntity<List<ShowTime>> getAllShowtimes() {
        return ResponseEntity.ok(showtimeService.getAllShowtime());
    }

    @GetMapping("/{showId}")
    public ResponseEntity<ShowTime> getShowtimeById(@PathVariable long showId) {
        return ResponseEntity.ok(showtimeService.getShowtimeById(showId));
    }

    @GetMapping("/movie/{movieId}/{date}")
    public ResponseEntity<List<ShowTime>> getShowtimesByDate(@PathVariable long movieId, @PathVariable String date) {
        return ResponseEntity.ok(showtimeService.getShowtimesByDate(movieId, date));
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<ShowTime>> getShowtimesByMovie(@PathVariable long movieId) {
        return ResponseEntity.ok(showtimeService.getShowtimesByMovie(movieId));
    }
    
    @DeleteMapping("/{showId}")
    public ResponseEntity<String> deleteShowtime(@PathVariable long showId) {
        showtimeService.deleteShowtimeById(showId);
        return ResponseEntity.ok("Showtime deleted successfully");
    }
}