import { Component, OnInit } from '@angular/core';
import { Showtime } from '../../models/showtime';
import { MovieService } from '../../services/movie-service';
import { ShowtimeService } from '../../services/showtime-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-adminmanage',
  standalone: false,
  templateUrl: './adminmanage.html',
  styleUrl: './adminmanage.css',
})
export class Adminmanage implements OnInit {
  movieId  : number = 0;
  movie    : any    = null;
  showtimes: Showtime[] = [];

  // ── Showtime Form ──
  showForm     : boolean = false;
  newTheater   : string  = '';
  newDate      : string  = '';
  newTime      : string  = '';

  // ── Available seat categories ──
  availableCategories = [
    { name: 'Classic',   icon: '🪑', color: 'bg-gray-400'   },
    { name: 'Prime',     icon: '⭐', color: 'bg-blue-400'   },
    { name: 'Premium',   icon: '💎', color: 'bg-purple-400' },
    { name: 'Recliners', icon: '🛋', color: 'bg-amber-400'  },
  ];

  selectedCategories: {
    name      : string;
    selected  : boolean;
    price     : number;
    totalSeats: number;
    icon      : string;
    color     : string;
  }[] = [];

  theaters: string[] = [
    'PVR : DLF Mall, Gurugram',
    'PVR : Ambience Mall, Gurugram',
    'INOX : M3M Broadway, Gurugram',
    'Cinepolis : Sector 29, Gurugram',
    'Miraj Cinemas : TGIP, Noida',
    'PVR : Pacific Mall, Delhi',
    'INOX : Nehru Place, Delhi',
    'Carnival Cinemas : Faridabad'
  ];

  constructor(
    private movieService    : MovieService,
    private showtimeService : ShowtimeService,
    private activatedRoute  : ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initCategories();
    this.activatedRoute.queryParams.subscribe(params => {
      this.movieId = Number(params['movieId']);
      this.loadMovie();
      this.loadShowtimes();
    });
  }

  initCategories(): void {
    this.selectedCategories = this.availableCategories.map(c => ({
      ...c,
      selected  : false,
      price     : 0,
      totalSeats: 50
    }));
  }

  // ── Loaders ──

  loadMovie(): void {
    this.movieService.getMovieById(this.movieId).subscribe({
      next : (data: any) => this.movie = data,
      error: (err: any)  => console.error('Failed to load movie', err)
    });
  }

  loadShowtimes(): void {
    this.showtimeService.getAllShowtimes().subscribe({
      next: (data: Showtime[]) => {
        this.showtimes = data.filter(
          (s: any) => s.movie?.movieId === this.movieId
        );
      },
      error: (err: any) => console.error('Failed to load showtimes', err)
    });
  }

  // ── Category Toggle ──

  toggleCategory(index: number): void {
    this.selectedCategories[index].selected =
      !this.selectedCategories[index].selected;
  }

  // ── Add Showtime ──

  addShowtime(): void {
    if (!this.newTheater || !this.newDate || !this.newTime) {
      alert('Please fill theater, date and time');
      return;
    }

    const chosenCategories = this.selectedCategories.filter(c => c.selected);

    if (chosenCategories.length === 0) {
      alert('Please select at least one seat category');
      return;
    }

    const hasInvalidPrice = chosenCategories.some(c => !c.price || c.price <= 0);
    if (hasInvalidPrice) {
      alert('Please enter a valid price for all selected categories');
      return;
    }

    const hasInvalidSeats = chosenCategories.some(c => !c.totalSeats || c.totalSeats <= 0);
    if (hasInvalidSeats) {
      alert('Please enter valid seat count for all selected categories');
      return;
    }

    // ✅ Total seats = sum of all category seats
    const totalSeats = chosenCategories.reduce(
      (sum, c) => sum + (c.totalSeats || 0), 0
    );

    const dto: any = {
      theater       : this.newTheater,
      showDate      : this.newDate,
      showTime      : this.newTime,
      totalSeats    : totalSeats,
      seatCategories: chosenCategories.map(c => ({
        name      : c.name,
        price     : c.price,
        totalSeats: c.totalSeats
      }))
    };

    this.showtimeService.addShowtime(this.movieId, dto).subscribe({
      next: () => {
        this.loadShowtimes();
        this.resetForm();
      },
      error: () => alert('Failed to add showtime')
    });
  }

  // ── Edit Showtime ──
editingShowtimeId : number | null = null;
editTheater       : string = '';
editDate          : string = '';
editTime          : string = '';

editSelectedCategories: {
  name          : string;
  selected      : boolean;
  price         : number;
  totalSeats    : number;
  availableSeats: number;
  categoryId    : number | null;
  icon          : string;
}[] = [];

startEdit(showtime: any): void {
  this.editingShowtimeId = showtime.showtimeId;
  this.editTheater       = showtime.theater;
  this.editDate          = showtime.showDate;
  this.editTime          = showtime.showTime;

  // ✅ Pre-populate categories from existing showtime
  this.editSelectedCategories = this.availableCategories.map(cat => {
    const existing = showtime.seatCategories?.find(
      (c: any) => c.name === cat.name
    );
    return {
      name          : cat.name,
      icon          : cat.icon,
      selected      : !!existing,
      price         : existing?.price     || 0,
      totalSeats    : existing?.totalSeats || 50,
      availableSeats: existing?.availableSeats || 0,
      categoryId    : existing?.categoryId || null
    };
  });
}

cancelEdit(): void {
  this.editingShowtimeId      = null;
  this.editSelectedCategories = [];
  this.editTheater = '';
  this.editDate    = '';
  this.editTime    = '';
}

toggleEditCategory(index: number): void {
  this.editSelectedCategories[index].selected =
    !this.editSelectedCategories[index].selected;
}

saveEdit(): void {
  if (!this.editTheater || !this.editDate || !this.editTime) {
    alert('Please fill theater, date and time');
    return;
  }

  const chosenCategories = this.editSelectedCategories.filter(c => c.selected);

  if (chosenCategories.length === 0) {
    alert('Please select at least one seat category');
    return;
  }

  const totalSeats = chosenCategories.reduce(
    (sum, c) => sum + (c.totalSeats || 0), 0
  );

  const dto: any = {
    theater       : this.editTheater,
    showDate      : this.editDate,
    showTime      : this.editTime,
    totalSeats    : totalSeats,
    availableSeats: totalSeats,
    seatCategories: chosenCategories.map(c => ({
      name          : c.name,
      price         : c.price,
      totalSeats    : c.totalSeats,
      availableSeats: c.availableSeats || c.totalSeats
    }))
  };

  this.showtimeService.updateShowtime(
    this.editingShowtimeId!, dto
  ).subscribe({
    next: () => {
      this.loadShowtimes();
      this.cancelEdit();
    },
    error: () => alert('Failed to update showtime')
  });
}
  // ── Delete Showtime ──

  deleteShowtime(showtimeId: number): void {
    if (!confirm('Delete this showtime?')) return;
    this.showtimeService.deleteShowtime(showtimeId).subscribe({
      next : () => this.loadShowtimes(),
      error: () => alert('Failed to delete showtime')
    });
  }

  // ── Reset Form ──

  resetForm(): void {
    this.newTheater = '';
    this.newDate    = '';
    this.newTime    = '';
    this.showForm   = false;
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
      .filter(c => c.selected)
      .reduce((sum, c) => sum + (c.totalSeats || 0), 0);
  }
}
