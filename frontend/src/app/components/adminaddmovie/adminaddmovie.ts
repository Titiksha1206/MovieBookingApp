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
      price: ['', [Validators.required, Validators.min(1)]]
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
      console.log(this.movie);
      this.movieForm.patchValue(this.movie);
    });
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
    if (this.movieForm.valid) {
      if (this.isEditing) {
        const updatedMovie = this.movieForm.value;
        updatedMovie['movieId'] = this.movie.movieId;
        this.updateMovie(updatedMovie);
      } else {
        this.addMovie(this.movieForm.value);
      }
    }
  }

  closeModal() {
    this.showModal = false;
  }

  navigateToMovies() {
    this.router.navigate(['/admin/view/Movies']);
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
get price() {
  return this.movieForm.get('price')!;
}
}