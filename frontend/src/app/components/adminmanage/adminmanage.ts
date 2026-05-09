import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Showtime } from '../../models/showtime';
import { MovieService } from '../../services/movie-service';
import { ShowtimeService } from '../../services/showtime-service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-adminmanage',
  standalone: false,
  templateUrl: './adminmanage.html',
  styleUrl: './adminmanage.css',
})
export class Adminmanage implements OnInit {
  movieId: number = 0;
  movie: any = null;
  showtimes: Showtime[] = [];
  showDeleteModal = false;
  selectedShowtimeId: number | null = null;

  // ── Showtime Form ──
  showForm: boolean = false;
  newTheater: string = '';
  newDate: string = '';
  newTime: string = '';

  // ── Available seat categories ──
  availableCategories = [
    { name: 'Classic', icon: '🪑', color: 'bg-gray-400' },
    { name: 'Prime', icon: '⭐', color: 'bg-blue-400' },
    { name: 'Premium', icon: '💎', color: 'bg-purple-400' },
    { name: 'Recliners', icon: '🛋', color: 'bg-amber-400' },
  ];

  selectedCategories: {
    name: string;
    selected: boolean;
    price: number;
    totalSeats: number;
    icon: string;
    color: string;
  }[] = [];

  theaters: string[] = [
    'PVR : DLF Mall, Gurugram',
    'PVR : Ambience Mall, Gurugram',
    'INOX : M3M Broadway, Gurugram',
    'Cinepolis : Sector 29, Gurugram',
    'Miraj Cinemas : TGIP, Noida',
    'PVR : Pacific Mall, Delhi',
    'INOX : Nehru Place, Delhi',
    'Carnival Cinemas : Faridabad',
  ];

  constructor(
    private movieService: MovieService,
    private showtimeService: ShowtimeService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.initCategories();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.movieId = Number(params['movieId']);
      this.loadMovie();
      this.loadShowtimes();
    });
  }

  initCategories(): void {
    this.selectedCategories = this.availableCategories.map((c) => ({
      ...c,
      selected: false,
      price: 0,
      totalSeats: 48,
    }));
  }

  // ── Loaders ──

  loadMovie(): void {
    this.movieService.getMovieById(this.movieId).subscribe({
      next: (data: any) => {
        this.movie = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificationService.error('Failed to load movie details');
      },
    });
  }

  loadShowtimes(): void {
    this.showtimeService.getAllShowtimes().subscribe({
      next: (data: Showtime[]) => {
        this.showtimes = data.filter((s: any) => s.movie?.movieId === this.movieId);
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificationService.error('Failed to load showtimes');
      },
    });
  }

  // ── Category Toggle ──

  toggleCategory(index: number): void {
    this.selectedCategories[index].selected = !this.selectedCategories[index].selected;
  }

  // ── Add Showtime ──

  addShowtime(): void {
    if (!this.newTheater || !this.newDate || !this.newTime) {
      this.notificationService.warning('Please fill theater, date and time');
      return;
    }

    const chosenCategories = this.selectedCategories.filter((c) => c.selected);

    if (chosenCategories.length === 0) {
      this.notificationService.warning('Please select at least one seat category');
      return;
    }

    const hasInvalidPrice = chosenCategories.some((c) => !c.price || c.price <= 0);
    if (hasInvalidPrice) {
      this.notificationService.warning('Please enter a valid price for all selected categories');
      return;
    }

    const hasInvalidSeats = chosenCategories.some((c) => !c.totalSeats || c.totalSeats <= 0);
    if (hasInvalidSeats) {
      this.notificationService.warning('Please enter valid seat count for all selected categories');
      return;
    }

    // ✅ Total seats = sum of all category seats
    const totalSeats = chosenCategories.reduce((sum, c) => sum + (c.totalSeats || 0), 0);

    const dto: any = {
      theater: this.newTheater,
      showDate: this.newDate,
      showTime: this.newTime,
      totalSeats: totalSeats,
      seatCategories: chosenCategories.map((c) => ({
        name: c.name,
        price: c.price,
        totalSeats: c.totalSeats,
      })),
    };

    this.showtimeService.addShowtime(this.movieId, dto).subscribe({
      next: () => {
        this.notificationService.success('Showtime added successfully');
        this.loadShowtimes();
        this.resetForm();
      },
      error: (err) => {
         // ✅ Extract error message properly
      let errorMessage = 'Failed to add showtime';
      
      if (err.error) {
        // Case 1: error.error is a string
        if (typeof err.error === 'string') {
          errorMessage = err.error;
        }
        // Case 2: error.error has a message property
        else if (err.error.message) {
          errorMessage = err.error.message;
        } else if (err.error.error && err.error.error.message) {
          errorMessage = err.error.error.message;
        }
      }
      // Case 4: err.message exists
      else if (err.message) {
        errorMessage = err.message;
      }
       if (err.status === 409) {
        if (errorMessage.includes('Showtime already exists') || errorMessage.includes('duplicate')) {
          errorMessage = 'A showtime with this theater, date, and time already exists.';
        } else if (errorMessage.includes('booking')) {
          errorMessage = 'Cannot modify showtime because it has existing bookings.';
        }
      }
      
      this.notificationService.error(errorMessage);
      },
    });
  }

  // ── Edit Showtime ──
  editingShowtimeId: number | null = null;
  editTheater: string = '';
  editDate: string = '';
  editTime: string = '';

  editSelectedCategories: {
    name: string;
    selected: boolean;
    price: number;
    totalSeats: number;
    availableSeats: number;
    categoryId: number | null;
    icon: string;
  }[] = [];

  startEdit(showtime: any): void {
    this.editingShowtimeId = showtime.showtimeId;
    this.editTheater = showtime.theater;
    this.editDate = showtime.showDate;
    this.editTime = showtime.showTime;

    // ✅ Pre-populate categories from existing showtime
    this.editSelectedCategories = this.availableCategories.map((cat) => {
      const existing = showtime.seatCategories?.find((c: any) => c.name === cat.name);
      return {
        name: cat.name,
        icon: cat.icon,
        selected: !!existing,
        price: existing?.price || 0,
        totalSeats: existing?.totalSeats || 50,
        availableSeats: existing?.availableSeats || 0,
        categoryId: existing?.categoryId || null,
      };
    });
  }
  // Add this method
  toggleAddForm(): void {
    if (this.showForm) {
      // Closing the form – reset all fields
      this.resetForm();
    } else {
      // Opening the form – optionally reset anyway to start fresh
      this.resetForm();
      this.showForm = true;
    }
  }
  cancelEdit(): void {
    this.editingShowtimeId = null;
    this.editSelectedCategories = [];
    this.editTheater = '';
    this.editDate = '';
    this.editTime = '';
  }

  toggleEditCategory(index: number): void {
    this.editSelectedCategories[index].selected = !this.editSelectedCategories[index].selected;
  }

  saveEdit(): void {
    if (!this.editTheater || !this.editDate || !this.editTime) {
      this.notificationService.warning('Please fill theater, date and time');
      return;
    }

    const chosenCategories = this.editSelectedCategories.filter((c) => c.selected);

    if (chosenCategories.length === 0) {
      this.notificationService.warning('Please select at least one seat category');
      return;
    }

    const totalSeats = chosenCategories.reduce((sum, c) => sum + (c.totalSeats || 0), 0);

    const dto: any = {
      theater: this.editTheater,
      showDate: this.editDate,
      showTime: this.editTime,
      totalSeats: totalSeats,
      availableSeats: totalSeats,
      seatCategories: chosenCategories.map((c) => ({
        name: c.name,
        price: c.price,
        totalSeats: c.totalSeats,
        availableSeats: c.availableSeats || c.totalSeats,
      })),
    };

    this.showtimeService.updateShowtime(this.editingShowtimeId!, dto).subscribe({
      next: () => {
        this.notificationService.success('Showtime updated successfully');
        this.loadShowtimes();
        this.cdr.detectChanges();
        this.cancelEdit();
      },
      error: (err) => {
        // ✅ Properly extract error message
        let errorMessage = 'Failed to update showtime';

        if (err.error) {
          if (typeof err.error === 'string') {
            errorMessage = err.error;
          } else if (err.error.message) {
            errorMessage = err.error.message;
          } else if (err.error.error && err.error.error.message) {
            errorMessage = err.error.error.message;
          }
        } else if (err.message) {
          errorMessage = err.message;
        }
        if (err.status === 409) {
          if (errorMessage.includes('Another showtime already exists')) {
            errorMessage = 'A showtime with this theater, date, and time already exists.';
          } else if (errorMessage.includes('existing booking')) {
            errorMessage = 'Cannot update showtime because it has existing bookings.';
          }
        }
        this.notificationService.error(errorMessage);
      },
    });
  }
  // ── Delete Showtime ──

  openDeleteModal(id: number): void {
    this.selectedShowtimeId = id;
    this.showDeleteModal = true;
  }

  closeModal(): void {
    this.showDeleteModal = false;
    this.selectedShowtimeId = null;
  }

  confirmDelete(): void {
    if (this.selectedShowtimeId !== null) {
      this.deleteShowtime(this.selectedShowtimeId);
    }
    this.closeModal();
  }

  deleteShowtime(showtimeId: number): void {
    this.showtimeService.deleteShowtime(showtimeId).subscribe({
      next: () => {
        (this.loadShowtimes(), this.notificationService.success('Showtime deleted successfully'));
      },
      error: (err) => {
        // ✅ Show proper error message for bookings
        if (err.status === 409) {
          const errorMsg =
            err.error?.message || 'Cannot delete showtime because it has existing bookings.';
          this.notificationService.error(errorMsg);
        } else if (err.status === 404) {
          this.notificationService.error('Showtime not found.');
        } else {
          const errorMsg = err.error?.message || err.message || 'Failed to delete showtime';
          this.notificationService.error(errorMsg);
        }
      },
    });
  }

  // ── Reset Form ──

  resetForm(): void {
    this.newTheater = '';
    this.newDate = '';
    this.newTime = '';
    this.showForm = false;
    this.initCategories();
  }

  // ── Helpers ──

  getAvailabilityColor(available: number, total: number): string {
    const pct = available / total;
    if (pct > 0.5) return 'text-green-400';
    if (pct > 0.2) return 'text-yellow-400';
    return 'text-red-400';
  }

  getAvailabilityLabel(available: number, total: number): string {
    const pct = available / total;
    if (pct > 0.5) return 'Available';
    if (pct > 0.2) return 'Filling fast';
    return 'Almost full';
  }

  getAvailabilityDot(available: number, total: number): string {
    const pct = available / total;
    if (pct > 0.5) return 'bg-green-400';
    if (pct > 0.2) return 'bg-yellow-400';
    return 'bg-red-400';
  }

  get todayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  get totalSelectedSeats(): number {
    return this.selectedCategories
      .filter((c) => c.selected)
      .reduce((sum, c) => sum + (c.totalSeats || 0), 0);
  }
}
