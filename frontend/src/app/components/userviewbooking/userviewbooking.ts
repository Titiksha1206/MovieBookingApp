import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { BookingService } from '../../services/booking-service';
import { Booking } from '../../models/booking';
import { isPlatformBrowser } from '@angular/common';
import { NotificationService } from '../../services/notification-service';

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
  isCancelling: boolean = false;

  constructor(
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
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
      this.notificationService.error(this.errorMessage);
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
        const message = err.error?.message || 'Failed to load bookings. Please try again later.';
        this.errorMessage = message;
        this.isLoading = false;
        this.notificationService.error(message);
      },
    });
  }

  cancelBooking(bookingId: number): void {
    if (this.isCancelling) return;

    this.isCancelling = true;
    this.bookingService.deleteBooking(bookingId).subscribe({
      next: () => {
        this.notificationService.success('Booking cancelled successfully.');
        this.loadUserBookings();
        this.isCancelling = false;
      },
      error: (err) => {
        console.log(err);
        const message = err.error?.message || 'Failed to cancel booking. Please try again.';
        this.errorMessage = message;
        this.notificationService.error(message);
        this.isCancelling = false;
      },
    });
  }
}
