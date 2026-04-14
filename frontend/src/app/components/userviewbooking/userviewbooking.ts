import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking-service';
import { AuthService } from '../../services/auth-service';
import { Booking } from '../../models/booking';

@Component({
  selector: 'app-userviewbooking',
  standalone: false,
  templateUrl: './userviewbooking.html',
  styleUrl: './userviewbooking.css',
})
export class Userviewbooking implements OnInit{
  bookings : Booking[] = [];
  userId!: number;
  errorMessage : string = '';
 
  constructor(
    private bookingService : BookingService,
    private authService : AuthService
  ) { }

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));
    this.loadUserBookings();
  }

  loadUserBookings(){
    this.bookingService.getUserBookings(this.userId).subscribe({
       next : (data : Booking[])=> {
            this.bookings = data;
            console.log(JSON.stringify(data));
       } ,
       error : (err) => {
        console.log(err);
        alert("Failed to load the bookings");
       }
    });
  }

  cancleBooking(bookingId : number){
     this.bookingService.deleteBooking(bookingId).subscribe( {
        next : (data : any) => {
          alert("Cancel booking Successfull");
          this.loadUserBookings();
        },
        error : (err) => {
          console.log(err);
          alert("Cancel booking failed");
        }
     })
  }
}
