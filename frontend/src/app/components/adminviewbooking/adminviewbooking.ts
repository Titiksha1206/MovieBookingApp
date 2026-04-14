import { Component } from '@angular/core';
import { BookingService } from '../../services/booking-service';
import { Booking } from '../../models/booking';

@Component({
  selector: 'app-adminviewbooking',
  standalone: false,
  templateUrl: './adminviewbooking.html',
  styleUrl: './adminviewbooking.css',
})
export class Adminviewbooking{
  bookings: Booking[] = [];
  errorMessage: string = '';

  constructor(
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings() {
    this.bookingService.getAllBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        console.log(JSON.stringify(data));
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load bookings';
        alert('Failed to load the Booking');
      }
    });
  }
}