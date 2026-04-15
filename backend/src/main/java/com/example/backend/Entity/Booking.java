package com.example.backend.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor 
@Getter
@Setter

// 👉 Marks this class as a JPA entity → table will be created in DB (booking table)
@Entity
public class Booking {

// 👉 @Id → Primary key
// 👉 @GeneratedValue → Auto-increment ID
// 👉 IDENTITY → DB handles ID generation
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
   private long bookingId;
   private int seatCount;
   private double totalCost;

// 👉 Many bookings → ONE movie(relationship)
// 👉 @JoinColumn → creates foreign key column movieId
// 👉 JsonBackReference -> Booking will NOT include movie in JSON response (prevents infinite recursion)
   @ManyToOne
   @JoinColumn(name = "movieId")
   @JsonBackReference
   private Movie movie;

// 👉 Many bookings → ONE user
// 👉 Creates: user_user_id (FK)
// 👉 JsonBackReference -> child
   @ManyToOne
   @JoinColumn(name = "userId")
   @JsonBackReference
   private User user;
}
