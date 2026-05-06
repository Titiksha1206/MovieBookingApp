import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { BookingService } from '../../services/booking-service';
import { Booking } from '../../models/booking';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-userviewbooking',
  standalone: false,
  templateUrl: './userviewbooking.html',
  styleUrl: './userviewbooking.css',
})
export class Userviewbooking implements OnInit {
  bookings: Booking[] = [];
  userId!: number;
  errorMessage: string = '';
  isLoading = true;

  constructor(
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.isLoading = false;
      return;
    }
    const id = localStorage.getItem('userId');

    if (!id) {
      this.errorMessage = 'Please log in to view your bookings.';
      this.isLoading = false;
      return;
    }

    this.userId = Number(id);

    this.loadUserBookings();
  }

  loadUserBookings(): void {
    this.isLoading = true;
    this.bookingService.getUserBookings(this.userId).subscribe({
      next: (data) => {
        this.bookings = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        const message = err.error?.message || 'Failed to load bookings. Please try again later.';
        this.errorMessage = message;
        this.isLoading = false;
        alert(message);
      },
    });
  }

  cancelBooking(bookingId: number): void {
    this.bookingService.deleteBooking(bookingId).subscribe({
      next: () => {
        alert('Cancel booking Successfull');
        this.loadUserBookings();
      },
      error: (err) => {
        console.log(err);
        const message = err.error?.message || 'Failed to cancel booking. Please try again.';
        this.errorMessage = message;
        alert(message);
      },
    });
  }
}
