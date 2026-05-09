import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking-service';
import { Booking } from '../../models/booking';
import { NotificationService } from '../../services/notification-service';

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
    private notificationService: NotificationService,
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
        this.errorMessage = 'Failed to load bookings';
        this.notificationService.error(this.errorMessage);
        this.isLoading = false;
      },
    });
  }
}
