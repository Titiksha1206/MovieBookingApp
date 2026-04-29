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
  isLoading = true;

  constructor(
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings() {
    this.isLoading = true;
    this.bookingService.getAllBookings().subscribe({
      next: (data) => {
        this.bookings = data;
         this.isLoading = false;
        console.log(JSON.stringify(data));
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load bookings';
        alert('Failed to load the Booking');
        this.isLoading = false;
      }
    });
  }
}