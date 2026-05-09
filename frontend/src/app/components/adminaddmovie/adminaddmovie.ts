import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie-service';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-adminaddmovie',
  standalone: false,
  templateUrl: './adminaddmovie.html',
  styleUrl: './adminaddmovie.css',
})
export class Adminaddmovie implements OnInit {
  movie: any = null;
  isEditing: boolean = false;
  movieForm!: FormGroup;
  showModal: boolean = false;
  modalMessage: string = '';
  previewUrl: string = '';
  durationHours: number = 0;
  durationMinutes: number = 0;
  isSubmitting = false;

  constructor(
    private movieService: MovieService,
    private builder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.movieForm = this.builder.group({
      title: ['', Validators.required],
      genre: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      language: ['', Validators.required],
      cbfc: ['', Validators.required],
      imageUrl: ['', Validators.required],
    });

    if (this.activatedRoute.snapshot.queryParamMap.has('movieId')) {
      this.isEditing = true;

      this.activatedRoute.queryParams.subscribe((queryParams) => {
        const id = queryParams['movieId'];
        this.loadMovie(id);
      });
    } else {
      this.isEditing = false;
    }
  }

  loadMovie(id: number): void {
    this.movieService.getMovieById(id).subscribe((data) => {
      this.movie = data;
      this.durationHours = Math.floor(data.duration / 60);
      this.durationMinutes = data.duration % 60;
      this.movieForm.patchValue(this.movie);
    });
  }

  onImageUrlChange(): void {
    this.previewUrl = this.movieForm.get('imageUrl')?.value || '';
  }

  updateMovie(movie: Movie): void {
    this.movieService.updateMovie(movie).subscribe({
      next: (data) => {
        this.movie = data;
        this.modalMessage = 'Movie updated successfully!';
        this.showModal = true;
        this.cdr.detectChanges();
        this.isSubmitting = false;
      },
      error: (err) => {
        if (err.status === 409) {
          this.notificationService.error(
            err.error?.message || 'Cannot update movie because it has existing bookings.',
          );
        } else {
          this.notificationService.error('Update failed: ' + (err.error?.message || err.message));
        }
        this.isSubmitting = false;
      },
    });
  }

  addMovie(movie: Movie): void {
    this.movieService.addMovie(movie).subscribe({
      next: (data) => {
        this.movie = data;
        this.modalMessage = 'Movie added successfully!';
        this.showModal = true;
        setTimeout(() => {
          this.isSubmitting = false;
          // Reset form if needed
          this.movieForm.reset();
          this.durationHours = 0;
          this.durationMinutes = 0;
          this.previewUrl = '';
        }, 0);
      },
      error: () => {
        this.notificationService.error('Failed to add movie');
        setTimeout(() => {
          this.isSubmitting = false;
        }, 0);
      },
    });
  }

  addOrUpdateMovie(): void {
    if (this.movieForm.valid) {
      this.isSubmitting = true;
      if (this.isEditing) {
        const updatedMovie = this.movieForm.value;
        updatedMovie['movieId'] = this.movie.movieId;
        this.updateMovie(updatedMovie);
      } else {
        this.addMovie(this.movieForm.value);
      }
    } else {
      this.notificationService.warning('Please fill all required fields');
    }
  }

  setCbfc(rating: string): void {
    this.movieForm.get('cbfc')?.setValue(rating);
    this.movieForm.get('cbfc')?.markAsTouched();
  }

  onLanguageChange(event: any): void {
    const value = event.target.value;
    this.movieForm.get('language')?.setValue(value);
    this.movieForm.get('language')?.markAsTouched();
  }

  closeModal(): void {
    this.showModal = false;
  }

  navigateToMovies(): void {
    this.router.navigate(['/admin/view/Movies']);
  }

  cancelEdit(): void {
    this.router.navigate(['/admin/view/Movies']);
  }

  updateDuration(): void {
    const total = this.durationHours * 60 + (this.durationMinutes || 0);
    this.movieForm.get('duration')?.setValue(total);
  }
  // Getters used in HTML template validation blocks
  get title() {
    return this.movieForm.get('title')!;
  }
  get genre() {
    return this.movieForm.get('genre')!;
  }
  get duration() {
    return this.movieForm.get('duration')!;
  }
  get language() {
    return this.movieForm.get('language')!;
  }
  get cbfc() {
    return this.movieForm.get('cbfc')!;
  }
  get imageUrl() {
    return this.movieForm.get('imageUrl')!;
  }
}
