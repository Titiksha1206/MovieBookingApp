import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie-service';

@Component({
  selector: 'app-adminaddmovie',
  standalone: false,
  templateUrl: './adminaddmovie.html',
  styleUrl: './adminaddmovie.css',
})
export class Adminaddmovie implements OnInit{
  movie: any = null;
  isEditing: boolean = false;
  movieForm!: FormGroup;
  showModal: boolean = false;
  modalMessage: string = '';
  previewUrl: string = '';
  durationHours: number = 0;
durationMinutes: number = 0;

  constructor(
    private movieService: MovieService,
    private builder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.movieForm = this.builder.group({
      title: ['', Validators.required],
      genre: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      language: ['', Validators.required],
      cbfc: ['', Validators.required],
      imageUrl: ['', Validators.required] 
    });

    if (this.activatedRoute.snapshot.queryParamMap.has('movieId')) {
      this.isEditing = true;

      this.activatedRoute.queryParams.subscribe(queryParams => {
        const id = queryParams['movieId'];
        this.loadMovie(id);
      });

    } else {
      this.isEditing = false;
    }
  }

  loadMovie(id: number) {
    this.movieService.getMovieById(id).subscribe(data => {
      this.movie = data;
       this.durationHours   = Math.floor(data.duration / 60);
    this.durationMinutes = data.duration % 60;
      console.log(this.movie);
      this.movieForm.patchValue(this.movie);
    });
  }

  onImageUrlChange() {
  this.previewUrl = this.movieForm.get('imageUrl')?.value || '';
  }
  
  updateMovie(movie: Movie) {
    this.movieService.updateMovie(movie).subscribe(data => {
      this.movie = data;
      this.modalMessage = "Movie updated successfully!";
      this.showModal = true;
    });
  }

  addMovie(movie: Movie) {
    this.movieService.addMovie(movie).subscribe(data => {
      this.movie = data;
      this.modalMessage = "Movie added successfully!";
      this.showModal = true;
    });
  }

  addOrUpdateMovie() {
    console.log('Form values:', this.movieForm.value);
    console.log('Form valid:', this.movieForm.valid);
    console.log('Language value:', this.movieForm.get('language')?.value);
    console.log('CBFC value:', this.movieForm.get('cbfc')?.value);
    
    if (this.movieForm.valid) {
      if (this.isEditing) {
        const updatedMovie = this.movieForm.value;
        updatedMovie['movieId'] = this.movie.movieId;
        this.updateMovie(updatedMovie);
      } else {
        this.addMovie(this.movieForm.value);
      }
    } else {
      alert('Please fill all required fields');
    }
  }

  setCbfc(rating: string) {
    this.movieForm.get('cbfc')?.setValue(rating);
    this.movieForm.get('cbfc')?.markAsTouched();
  }

  onLanguageChange(event: any) {
    const value = event.target.value;
    this.movieForm.get('language')?.setValue(value);
    this.movieForm.get('language')?.markAsTouched();
  }

  closeModal() {
    this.showModal = false;
  }

  navigateToMovies() {
    this.router.navigate(['/admin/view/Movies']);
  }

  updateDuration(): void {
  const total = (this.durationHours * 60) + (this.durationMinutes || 0);
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