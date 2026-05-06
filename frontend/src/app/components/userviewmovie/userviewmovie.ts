import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie-service';
import { Router } from '@angular/router';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-userviewmovie',
  standalone: false,
  templateUrl: './userviewmovie.html',
  styleUrl: './userviewmovie.css',
})
export class Userviewmovie implements OnInit {
  movies: Movie[] = [];
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private movieService: MovieService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;
    this.movieService.getAllMovies().subscribe({
      next: (data) => {
        this.movies = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load movies. Please try again later.';
        this.loading = false;
      },
    });
  }

  navigateToBooking(movieId: number) {
    this.router.navigate(['/user/bookMovie'], { queryParams: { movieId: movieId } });
  }
}
