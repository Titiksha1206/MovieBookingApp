package com.example.backend.Entity;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

@Entity
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long movieId;
    private String title;
    private int duration;
    private String genre;
    private int price;
    
    // 👉 mappedBy = "movie" -> The relationship is controlled by the movie field inside Booking class
    // 👉 cascade = CascadeType.ALL -> This controls what happens to bookings when movie changes
    // 👉 orphanRemoval = true → If a booking is removed from list → delete it from DB
    // 👉 JsonManagedReference -> Movie will include bookings in JSON response (parent side of relationship)
    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("movie-booking")
    private List<Booking> bookings = new ArrayList<>();
}
