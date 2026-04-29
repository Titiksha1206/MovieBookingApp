package com.example.backend.Entity;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SeatCategoryResponseDto {
    private Long categoryId;
    private String name;
    private double price;
    private Integer totalSeats;
    private Integer availableSeats;
    private List<Seat> seats;
}
