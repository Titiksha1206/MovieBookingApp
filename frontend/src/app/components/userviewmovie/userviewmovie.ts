import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie-service';
import { Router } from '@angular/router';
import { Movie } from '../../models/movie';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-userviewmovie',
  standalone: false,
  templateUrl: './userviewmovie.html',
  styleUrl: './userviewmovie.css',
})
export class Userviewmovie implements OnInit {
  allMovies: Movie[] = [];
  movies: Movie[] = [];
  loading = false;
  searchTerm: string = '';
  selectedLanguage: string = '';
  selectedGenre: string = '';
  languages: string[] = [];
  genres: string[] = [];
  errorMessage: string | null = null;

  constructor(
    private movieService: MovieService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;
    this.movieService.getAllMovies().subscribe({
      next: (data) => {
        this.allMovies = data;
        // ✅ Extract unique languages from movies
        this.languages = [...new Set(data.map((movie) => movie.language).filter((l) => l))];
        this.languages.sort();

        // ✅ Extract unique genres (split by comma and trim)
        const allGenres: string[] = [];
        data.forEach((movie) => {
          if (movie.genre) {
            movie.genre.split(',').forEach((g: string) => {
              const trimmed = g.trim();
              if (trimmed && !allGenres.includes(trimmed)) {
                allGenres.push(trimmed);
              }
            });
          }
        });
        this.genres = allGenres.sort();

        this.applyFilters();

        this.movies = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load movies. Please try again later.';
        this.notificationService.error(this.errorMessage);
        this.loading = false;
      },
    });
  }

  // ✅ Apply both search and language filters
  applyFilters(): void {
    let filtered = [...this.allMovies];

    // Apply language filter
    if (this.selectedLanguage) {
      filtered = filtered.filter((movie) => movie.language === this.selectedLanguage);
    }

    // ✅ Apply genre filter (movie.genre may contain comma-separated values)
    if (this.selectedGenre) {
      filtered = filtered.filter(
        (movie) =>
          movie.genre && movie.genre.toLowerCase().includes(this.selectedGenre.toLowerCase()),
      );
    }

    // Apply search filter (by title)
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter((movie) => movie.title.toLowerCase().includes(term));
    }

    this.movies = filtered;
  }
  // ✅ Search method
  onSearch(): void {
    this.applyFilters();
  }
  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }
  // ✅ Language filter method
  filterByLanguage(language: string): void {
    this.selectedLanguage = language;
    this.applyFilters();
  }

  // ✅ Clear language filter
  clearLanguageFilter(): void {
    this.selectedLanguage = '';
    this.applyFilters();
  }
  // ✅ Genre filter methods
  filterByGenre(genre: string): void {
    this.selectedGenre = genre;
    this.applyFilters();
  }

  clearGenreFilter(): void {
    this.selectedGenre = '';
    this.applyFilters();
  }

  // ✅ Clear all filters
  clearAllFilters(): void {
    this.searchTerm = '';
    this.selectedLanguage = '';
    this.selectedGenre = '';
    this.applyFilters();
  }

  navigateToBooking(movieId: number) {
    this.router.navigate(['/user/bookMovie'], { queryParams: { movieId: movieId } });
  }
}
