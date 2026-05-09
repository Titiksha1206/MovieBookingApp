import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie-service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-adminviewmovie',
  standalone: false,
  templateUrl: './adminviewmovie.html',
  styleUrl: './adminviewmovie.css',
})
export class Adminviewmovie implements OnInit {
  allMovies: Movie[] = [];
  searchTerm: string = '';
  movies: Movie[] = [];
  errorMessage: string = '';
  showDeleteModal = false;
  selectedMovieId: number | null = null;
  isLoading = true;

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
    this.isLoading = true;
    this.movieService.getAllMovies().subscribe({
      next: (data) => {
        this.allMovies = data;
        this.movies = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificationService.error('Failed to load movies');
        this.isLoading = false;
      },
    });
  }

  // ✅ Search method
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.movies = this.allMovies;
      return;
    }
    const term = this.searchTerm.toLowerCase().trim();
    this.movies = this.allMovies.filter((movie) => movie.title.toLowerCase().includes(term));
  }
  // ✅ Clear search
  clearSearch(): void {
    this.searchTerm = '';
    this.movies = this.allMovies;
  }

  openDeleteModal(id: number): void {
    this.selectedMovieId = id;
    this.showDeleteModal = true;
  }

  closeModal(): void {
    this.showDeleteModal = false;
    this.selectedMovieId = null;
  }

  confirmDelete(): void {
    if (this.selectedMovieId !== null) {
      this.deleteMovie(this.selectedMovieId);
    }
    this.closeModal();
  }

  deleteMovie(movieId: number): void {
    this.movieService.deleteMovie(movieId).subscribe({
      next: () => {
        this.loadMovies();
        this.cdr.detectChanges();
      },
      error: (err) => {
        let errorMessage = 'Failed to delete movie';
        if (err.status === 409) {
          errorMessage = 'Cannot delete movie because it has existing bookings.';
        }

        // ✅ Show error notification FIRST
        this.notificationService.error(errorMessage, 3000);
      },
    });
  }

  updateMovie(movieId: number): void {
    this.router.navigate(['/admin/add/newMovies'], { queryParams: { movieId: movieId } });
  }

  manageMovie(movieId: number): void {
    this.router.navigate(['/admin/manage'], { queryParams: { movieId } });
  }
}
