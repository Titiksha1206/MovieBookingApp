package com.example.backend.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.Entity.Booking;
import com.example.backend.Entity.Movie;
import com.example.backend.Entity.MovieDto;
import com.example.backend.Exception.DuplicateMovieException;
import com.example.backend.Exception.MovieNotFoundException;
import com.example.backend.Repository.BookingRepo;
import com.example.backend.Repository.MovieRepo;

@Service
public class MovieServiceImpl implements MovieService {

    private final MovieRepo repo;
    private final BookingRepo bookingRepo;

    public MovieServiceImpl(MovieRepo repo, BookingRepo bookingRepo) {
        this.repo = repo;
        this.bookingRepo = bookingRepo;
    }

    @Override
    public Movie addMovie(MovieDto dto) {

        if (repo.existsByTitleIgnoreCase(dto.getTitle())) {
            throw new DuplicateMovieException("Movie with title '" + dto.getTitle() + "' already exists");
        }

        Movie movie = new Movie();
        movie.setTitle(dto.getTitle());
        movie.setGenre(dto.getGenre());
        movie.setDuration(dto.getDuration());
        movie.setLanguage(dto.getLanguage());
        movie.setCbfc(dto.getCbfc());
        movie.setImageUrl(dto.getImageUrl());
        return repo.save(movie);
    }

    @Override
    public Movie updateMovie(long movieId, MovieDto movie) {
        Movie existing = repo.findById(movieId)
                .orElseThrow(() -> new MovieNotFoundException("Movie not found with id: " + movieId));

        // ✅ Check if there are any bookings for this movie
        long bookingCount = bookingRepo.countByMovie_MovieId(movieId);
        if (bookingCount > 0) {
            throw new IllegalStateException(
                    "Cannot update movie because it has " + bookingCount + " existing booking(s).");
        }
        existing.setTitle(movie.getTitle());
        existing.setDuration(movie.getDuration());
        existing.setGenre(movie.getGenre());
        existing.setLanguage(movie.getLanguage());
        existing.setCbfc(movie.getCbfc());
        existing.setImageUrl(movie.getImageUrl());

        return repo.save(existing);
    }

    @Override
    public List<Movie> getAllMovies() {
        return repo.findAll();
    }

    @Override
    public Movie getMovieById(long movieId) {
        return repo.findById(movieId)
                .orElseThrow(() -> new MovieNotFoundException("Movie not found with id: " + movieId));
    }

    @Override
    public boolean deleteMovieById(long movieId) {
        if (!repo.existsById(movieId)) {
            throw new MovieNotFoundException("Movie not found with id: " + movieId);
        }
        // ✅ Check for upcoming/ongoing bookings (today or future)
        String today = java.time.LocalDate.now().toString(); // YYYY-MM-DD
        boolean hasUpcomingBookings = bookingRepo.existsUpcomingBookingForMovie(movieId, today);

        if (hasUpcomingBookings) {
            long upcomingCount = bookingRepo.countUpcomingBookingsForMovie(movieId, today);
            throw new IllegalStateException(
                    "Cannot delete movie because it has " + upcomingCount
                            + " upcoming booking(s) for shows today or in the future.");
        }

        repo.deleteById(movieId);
        return true;
    }

    @Override
    public List<Booking> findAllBookingsByMovie(long movieId) {
        Movie movie = repo.findById(movieId)
                .orElseThrow(() -> new MovieNotFoundException("Movie not found with id: " + movieId));

        return movie.getBookings();
    }

    @Override
    public List<Movie> searchMoviesByTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            return repo.findAll(); // or throw exception
        }
        return repo.findByTitleContainingIgnoreCase(title.trim());
    }
}
