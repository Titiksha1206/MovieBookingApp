import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShowtimeService } from '../../services/showtime-service';
import { BookingService } from '../../services/booking-service';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-userseatselection',
  standalone: false,
  templateUrl: './userseatselection.html',
  styleUrl: './userseatselection.css',
})
export class Userseatselection implements OnInit {
  showtimeId: number = 0;
  movieId: number = 0;
  userId: number = 0;
  showtime: any = null;
  seatCategories: any[] = [];
  selectedSeats: any[] = [];
  loadingSeats: boolean = true;
  totalCost: number = 0;

  // Storage keys
  private readonly DRAFT_KEY = 'booking_draft';

  constructor(
    private showtimeService: ShowtimeService,
    private bookingService: BookingService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.showtimeId = Number(params['showtimeId']);
      this.movieId = Number(params['movieId']);
      this.userId = Number(localStorage.getItem('userId') || 0);
      this.loadSeats();
    });
  }

  loadSeats(): void {
    this.loadingSeats = true;

    this.showtimeService.getSeatsByShowtime(this.showtimeId).subscribe({
      next: (data) => {
        this.seatCategories = data;
        this.loadingSeats = false;
        this.cdr.detectChanges();

        // Restore any saved draft after seats are loaded
        this.restoreDraft();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.loadingSeats = false;
        this.notificationService.error('Failed to load seats');
      },
    });
  }

  // ─── Save current selection to localStorage ───
  private saveDraft(): void {
    const draft = {
      movieId: this.movieId,
      showtimeId: this.showtimeId,
      seatIds: this.selectedSeats.map((s) => s.seatId),
      totalCost: this.totalCost,
    };
    localStorage.setItem(this.DRAFT_KEY, JSON.stringify(draft));
  }

  // ─── Restore previously saved selection (if same showtime) ───
  private restoreDraft(): void {
    const draftJson = localStorage.getItem(this.DRAFT_KEY);
    if (!draftJson) return;

    const draft = JSON.parse(draftJson);
    // Only restore if it's the exact same showtime
    if (draft.showtimeId !== this.showtimeId) return;

    const draftSeatIds = draft.seatIds as number[];
    if (!draftSeatIds.length) return;

    // Clear current selection
    this.selectedSeats = [];

    // Iterate through all seats and mark them as selected if they were in the draft and still available
    for (const category of this.seatCategories) {
      for (const seat of category.seats) {
        if (draftSeatIds.includes(seat.seatId) && seat.status === 'AVAILABLE') {
          this.selectedSeats.push({
            ...seat,
            price: category.price,
            categoryName: category.name,
          });
        }
      }
    }

    this.updateTotalCost();
    // Remove the draft after restoring (so it doesn't reappear on next refresh)
    localStorage.removeItem(this.DRAFT_KEY);
  }

  toggleSeat(seat: any, category: any): void {
    if (seat.status === 'BOOKED') return;

    const idx = this.selectedSeats.findIndex((s) => s.seatId === seat.seatId);
    if (idx > -1) {
      this.selectedSeats.splice(idx, 1);
    } else {
      this.selectedSeats.push({
        ...seat,
        price: category.price,
        categoryName: category.name,
      });
    }
    this.updateTotalCost();
  }

  isSeatSelected(seatId: number): boolean {
    return this.selectedSeats.some((s) => s.seatId === seatId);
  }

  updateTotalCost(): void {
    this.totalCost = this.selectedSeats.reduce((sum, s) => sum + s.price, 0);
  }

  getRows(seats: any[]): { rowLabel: string; seats: any[] }[] {
    const groups: { [key: string]: any[] } = {};
    seats.forEach((seat) => {
      if (!groups[seat.rowLabel]) groups[seat.rowLabel] = [];
      groups[seat.rowLabel].push(seat);
    });
    return Object.keys(groups)
      .sort()
      .map((row) => ({
        rowLabel: row,
        seats: groups[row].sort((a, b) => a.seatNumber - b.seatNumber),
      }));
  }

  showAisle(seatNumber: number): boolean {
    return seatNumber === 4 || seatNumber === 7 || seatNumber === 10 || seatNumber === 13;
  }

  registerBooking(): void {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');

    // ✅ Check if user is logged in
    if (!userId || !token) {
      // Save current selection and redirect to login
      if (this.selectedSeats.length > 0) {
        this.saveDraft();
      }
      this.notificationService.error('Please login to book tickets.');
      const currentUrl = this.router.url;
      localStorage.setItem('returnUrl', currentUrl);

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 900);
      return;
    }

    // ✅ Check if logged-in user is ADMIN – prevent booking
    if (userRole === 'ADMIN') {
      this.notificationService.error('Admins cannot book tickets. Please use a user account.');
      return;
    }

    // ✅ Check if seats are selected
    if (this.selectedSeats.length === 0) {
      this.notificationService.warning('Please select at least one seat');
      return;
    }

    const booking: any = {
      seatCount: this.selectedSeats.length,
      totalCost: this.totalCost,
      seatIds: this.selectedSeats.map((s) => s.seatId),
      showtimeId: this.showtimeId,
    };

    this.bookingService.addBooking(booking, this.movieId, Number(userId)).subscribe({
      next: () => {
        localStorage.removeItem(this.DRAFT_KEY);
        this.notificationService.success('Booking successful!');
        setTimeout(() => {
          // ✅ Clear any stale returnUrl to prevent redirect loop
          localStorage.removeItem('returnUrl');
          this.router.navigate(['/user/view/Mybookings']);
        }, 500);
      },
      error: (err) => {
        const errorMsg = err.error?.message || err.message || 'Booking Failed';
        this.notificationService.error(errorMsg);
      },
    });
  }
  getCategoryIcon(name: string): string {
    const icons: any = {
      Classic: '🪑',
      Prime: '⭐',
      Premium: '💎',
      Recliners: '🛋',
    };
    return icons[name] || '💺';
  }

  goBack(): void {
    this.router.navigate(['/user/bookMovie'], { queryParams: { movieId: this.movieId } });
  }
}
