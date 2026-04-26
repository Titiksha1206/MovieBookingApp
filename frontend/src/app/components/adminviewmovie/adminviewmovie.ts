import { Component, OnInit } from '@angular/core';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminviewmovie',
  standalone: false,
  templateUrl: './adminviewmovie.html',
  styleUrl: './adminviewmovie.css',
})
export class Adminviewmovie implements OnInit {
   movies : Movie[] = [];
   errorMessage : string = '';

  constructor(
    private movieService : MovieService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies() {
     this.movieService.getAllMovies().subscribe({
      next: (data) => {
        this.movies = data;
      },
      error: (err) => {
       alert("Failed to load movies");
        console.error(err);
      }
     })
    }

    showDeleteModal = false;
selectedMovieId: number | null = null;

openDeleteModal(id: number) {
  this.selectedMovieId = id;
  this.showDeleteModal = true;
}

closeModal() {
  this.showDeleteModal = false;
  this.selectedMovieId = null;
}

confirmDelete() {
  if (this.selectedMovieId !== null) {
    this.deleteMovie(this.selectedMovieId);
  }
  this.closeModal();
}

  deleteMovie(movieId : number) {
    this.movieService.deleteMovie(movieId).subscribe({
      next: () => {
        //this.toastr.success("Movie deleted successfully!", "Success");  
        this.loadMovies();
      },
      error: (err) => {
        alert("Failed to delete movie");  
        console.error(err);
      }
    });
  }
  

  updateMovie(movieId : number) {
      this.router.navigate(['/admin/add/newMovies'], {queryParams:{movieId : movieId}})
  }
  
  manageMovie(movieId: number): void {
  this.router.navigate(['/admin/manage'], { queryParams: { movieId } });
  } 
}
