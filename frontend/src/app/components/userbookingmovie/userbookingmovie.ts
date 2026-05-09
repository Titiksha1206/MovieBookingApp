import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ShowtimeService } from '../../services/showtime-service';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-userbookingmovie',
  standalone: false,
  templateUrl: './userbookingmovie.html',
  styleUrl: './userbookingmovie.css',
})
export class Userbookingmovie implements OnInit {
  movie!: Movie;
  movieId!: number;

  // ── Date Strip ──
  dates: Date[] = [];
  selectedDateIndex: number = 0;
  selectedDate: Date = new Date();

  // ── Showtimes ──
  showtimes: any[] = [];
  selectedShowtime: any = null;

  constructor(
    private movieService: MovieService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private showtimeService: ShowtimeService,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.generateDates();

    this.activatedRoute.queryParams.subscribe((params) => {
      this.movieId = params['movieId'];
      this.loadMovie();
      this.loadShowtimes();
    });
  }

  // ── Date Logic ──
  generateDates(): void {
    this.dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      this.dates.push(new Date(d));
    }
    this.selectedDate = this.dates[0];
    this.selectedDateIndex = 0;
  }

  selectDate(index: number): void {
    this.selectedDateIndex = index;
    this.selectedDate = this.dates[index];
    this.selectedShowtime = null;
  }

  // ── API Calls ──
  loadMovie(): void {
    this.movieService.getMovieById(this.movieId).subscribe({
      next: (data) => {
        this.movie = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notificationService.error('Failed to load movie details');
      },
    });
  }

  loadShowtimes(): void {
    this.showtimeService.getShowtimesByMovie(this.movieId).subscribe({
      next: (data) => {
        this.showtimes = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notificationService.error('Failed to load showtimes');
      },
    });
  }

  // ── Navigation ──
  selectShowtime(showtime: any): void {
    this.router.navigate(['/user/selectSeats'], {
      queryParams: {
        showtimeId: showtime.showtimeId,
        movieId: this.movieId,
      },
    });
  }

  // ── Helpers ──
  formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  getMonthName(date: Date): string {
    return date.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase();
  }

  getDayName(date: Date): string {
    return date.toLocaleDateString('en-IN', { weekday: 'short' });
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

  // ── Grouped Showtimes ──
  get groupedShowtimes(): { theater: string; shows: any[] }[] {
    const dateStr = this.formatDate(this.selectedDate);
    const filtered = this.showtimes.filter((s: any) => s.showDate === dateStr);

    const groups: { [key: string]: any[] } = {};

    filtered.forEach((s: any) => {
      if (!groups[s.theater]) groups[s.theater] = [];
      groups[s.theater].push(s);
    });

    return Object.keys(groups).map((theater) => ({
      theater,
      shows: groups[theater].sort((a, b) => a.showTime.localeCompare(b.showTime)),
    }));
  }
}
