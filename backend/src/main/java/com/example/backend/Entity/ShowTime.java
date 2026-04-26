package com.example.backend.Entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
public class ShowTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long showtimeId;
    private String showDate;       
    private String showTime;        
    private String theater; 
    private Integer totalSeats;
    private Integer availableSeats; 

    @ManyToOne
    @JoinColumn(name = "movieId")
    // @JsonBackReference("movie-showtime")
    private Movie movie;

    @OneToMany(mappedBy = "showtime", cascade = CascadeType.ALL, orphanRemoval = true)
    // @JsonManagedReference("showtime-category")
    @JsonIgnoreProperties("showtime")  
    private List<SeatCategory> seatCategories = new ArrayList<>();
}
