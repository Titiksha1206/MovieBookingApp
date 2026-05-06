import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking-service';
import { Booking } from '../../models/booking';

@Component({
  selector: 'app-adminviewbooking',
  standalone: false,
  templateUrl: './adminviewbooking.html',
  styleUrl: './adminviewbooking.css',
})
export class Adminviewbooking implements OnInit {
  bookings: Booking[] = [];
  errorMessage: string = '';
  isLoading = true;

  constructor(
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading = true;
    this.bookingService.getAllBookings().subscribe({
      next: (data) => {
        this.bookings = data;

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load bookings';
        alert('Failed to load the Booking');
        this.isLoading = false;
      },
    });
  }
}
