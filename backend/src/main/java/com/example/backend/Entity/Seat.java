package com.example.backend.Entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

@Entity
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seatId;
    private String rowLabel;
    private Integer seatNumber;
    private String status;

    @ManyToOne
    @JoinColumn(name = "categoryId")
    // @JsonIgnore
    @JsonIgnoreProperties("seats")
    private SeatCategory category;

    @ManyToMany(mappedBy = "seats")
    @JsonIgnore // Seats don't need to know which bookings they belong to in API
    private List<Booking> bookings;
}
