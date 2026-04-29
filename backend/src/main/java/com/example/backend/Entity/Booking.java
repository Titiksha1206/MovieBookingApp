package com.example.backend.Entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

// 👉 Marks this class as a JPA entity → table will be created in DB (booking
// table)
@Entity
public class Booking {

   // 👉 @Id → Primary key
   // 👉 @GeneratedValue → Auto-increment ID
   // 👉 IDENTITY → DB handles ID generation
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long bookingId;
   private Integer seatCount;
   private Double totalCost;
   private String status;

   // 👉 Many bookings → ONE movie(relationship)
   // 👉 @JoinColumn → creates foreign key column movieId
   // 👉 JsonBackReference -> Booking will NOT include movie in JSON response
   // (prevents infinite recursion)
   @ManyToOne
   @JoinColumn(name = "movieId")
   @JsonIgnoreProperties({ "bookings", "showtimes" })
   // @JsonBackReference("movie-booking")
   private Movie movie;

   // 👉 Many bookings → ONE user
   // 👉 Creates: user_user_id (FK)
   // 👉 JsonBackReference -> child
   @ManyToOne
   @JoinColumn(name = "userId")
   // @JsonBackReference("user-booking")
   @JsonIgnore
   private User user;

   @ManyToMany
   @JoinTable(name = "booking_seats", joinColumns = @JoinColumn(name = "booking_id"), inverseJoinColumns = @JoinColumn(name = "seat_id"))
   @JsonIgnoreProperties("bookings")
   private List<Seat> seats = new ArrayList<>();

   @ManyToOne
   @JoinColumn(name = "showtime_id")
   private ShowTime showtime;
}
