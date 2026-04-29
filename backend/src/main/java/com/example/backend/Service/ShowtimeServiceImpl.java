package com.example.backend.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.backend.Entity.Movie;
import com.example.backend.Entity.Seat;
import com.example.backend.Entity.SeatCategory;
import com.example.backend.Entity.SeatCategoryResponseDto;
import com.example.backend.Entity.ShowTime;
import com.example.backend.Exception.DuplicateShowtimeException;
import com.example.backend.Exception.MovieNotFoundException;
import com.example.backend.Exception.ShowtimeNotFoundException;
import com.example.backend.Repository.MovieRepo;
import com.example.backend.Repository.ShowtimeRepo;

@Service
public class ShowtimeServiceImpl implements ShowtimeService {

    private final ShowtimeRepo showtimeRepo;
    private final MovieRepo movieRepo;

    private static final int SEATS_PER_ROW = 15;
    private static final String ROW_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    public ShowtimeServiceImpl(
            ShowtimeRepo showtimeRepo,
            MovieRepo movieRepo) {
        this.showtimeRepo = showtimeRepo;
        this.movieRepo = movieRepo;
    }

    @Override
    public ShowTime addShowtime(ShowTime showtime, long movieId) {
        Movie movie = movieRepo.findById(movieId)
                .orElseThrow(() -> new MovieNotFoundException(
                        "Movie not found with id: " + movieId));

        if (showtimeRepo.existsByTheaterAndShowDateAndShowTime(
                showtime.getTheater(),
                showtime.getShowDate(),
                showtime.getShowTime())) {
            throw new DuplicateShowtimeException(
                    "Showtime already exists at " + showtime.getTheater() +
                            " on " + showtime.getShowDate() + " at " + showtime.getShowTime());
        }
        showtime.setMovie(movie);
        showtime.setAvailableSeats(showtime.getTotalSeats());

        if (showtime.getSeatCategories() != null) {
            List<SeatCategory> categories = new ArrayList<>();

            for (SeatCategory cat : showtime.getSeatCategories()) {
                cat.setAvailableSeats(cat.getTotalSeats());
                cat.setShowtime(showtime);

                // generate seats
                List<Seat> seats = generateSeats(cat);
                cat.setSeats(seats);

                categories.add(cat);
            }

            showtime.setSeatCategories(categories);
        }

        return showtimeRepo.save(showtime);
    }

    @Override
    public ShowTime updateShowtime(long showId, ShowTime showtime) {
        ShowTime existing = showtimeRepo.findById(showId)
                .orElseThrow(() -> new ShowtimeNotFoundException(
                        "Showtime not found with id: " + showId));

        // Check if updating to a theater/date/time that conflicts with another showtime
        boolean conflict = showtimeRepo.existsByTheaterAndShowDateAndShowTime(
                showtime.getTheater(),
                showtime.getShowDate(),
                showtime.getShowTime());

        if (conflict) {
            Optional<ShowTime> conflicting = showtimeRepo.findByTheaterAndShowDateAndShowTime(
                    showtime.getTheater(),
                    showtime.getShowDate(),
                    showtime.getShowTime());
            if (conflicting.isPresent() && conflicting.get().getShowtimeId() != showId) {
                throw new DuplicateShowtimeException(
                        "Another showtime already exists at " + showtime.getTheater() +
                                " on " + showtime.getShowDate() + " at " + showtime.getShowTime());
            }
        }
        existing.setTheater(showtime.getTheater());
        existing.setShowDate(showtime.getShowDate());
        existing.setShowTime(showtime.getShowTime());
        existing.setTotalSeats(showtime.getTotalSeats());
        existing.setAvailableSeats(showtime.getTotalSeats());

        // Clear existing categories first (orphanRemoval will delete them)
        existing.getSeatCategories().clear();

        // Add new categories linked to existing showtime
        if (showtime.getSeatCategories() != null) {
            for (SeatCategory cat : showtime.getSeatCategories()) {
                cat.setAvailableSeats(cat.getTotalSeats());
                cat.setShowtime(existing);
                // ✅ Generate seats for each new category
                List<Seat> seats = generateSeats(cat);
                cat.setSeats(seats);
                existing.getSeatCategories().add(cat);
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
        if (!movieRepo.existsById(movieId)) {
            throw new MovieNotFoundException("Movie not found with id: " + movieId);
        }
        return showtimeRepo.findByMovie_MovieIdAndShowDate(movieId, date);
    }

    @Override
    public List<ShowTime> getShowtimesByMovie(long movieId) {
        if (!movieRepo.existsById(movieId)) {
            throw new MovieNotFoundException("Movie not found with id: " + movieId);
        }
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

    // @Override
    // public List<SeatCategory> getSeatsByShowtime(long showtimeId) {
    // ShowTime showtime = showtimeRepo.findById(showtimeId)
    // .orElseThrow(() -> new ShowtimeNotFoundException("Showtime not found"));

    // return showtime.getSeatCategories();
    // }

    // @Override
    // public List<Seat> getAllSeatsByShowtime(long showtimeId) {
    // if (!showtimeRepo.existsById(showtimeId)) {
    // throw new ShowtimeNotFoundException("Showtime not found with id: " +
    // showtimeId);
    // }

    // return seatRepo.findByCategory_Showtime_ShowtimeId(showtimeId);
    // }

    @Override
    public List<SeatCategoryResponseDto> getSeatCategoriesByShowtime(long showtimeId) {
        ShowTime showtime = showtimeRepo.findById(showtimeId)
                .orElseThrow(() -> new ShowtimeNotFoundException("Showtime not found with id: " + showtimeId));

        List<SeatCategoryResponseDto> response = new ArrayList<>();

        for (SeatCategory category : showtime.getSeatCategories()) {
            int availableSeats = (int) category.getSeats().stream()
                    .filter(seat -> "AVAILABLE".equals(seat.getStatus()))
                    .count();

            SeatCategoryResponseDto dto = new SeatCategoryResponseDto();
            dto.setCategoryId(category.getCategoryId());
            dto.setName(category.getName());
            dto.setPrice(category.getPrice());
            dto.setTotalSeats(category.getTotalSeats());
            dto.setAvailableSeats(availableSeats);
            dto.setSeats(category.getSeats());

            response.add(dto);
        }

        return response;
    }

    private List<Seat> generateSeats(SeatCategory cat) {
        List<Seat> seats = new ArrayList<>();
        int total = cat.getTotalSeats();
        int rows = (int) Math.ceil((double) total / SEATS_PER_ROW);
        int seatCount = 0;

        for (int r = 0; r < rows && seatCount < total; r++) {
            String rowLabel = String.valueOf(ROW_LABELS.charAt(r));

            for (int s = 1; s <= SEATS_PER_ROW && seatCount < total; s++) {
                Seat seat = new Seat();
                seat.setRowLabel(rowLabel);
                seat.setSeatNumber(s);
                seat.setStatus("AVAILABLE");
                seat.setCategory(cat);

                seats.add(seat);
                seatCount++;
            }
        }

        return seats;
    }
}