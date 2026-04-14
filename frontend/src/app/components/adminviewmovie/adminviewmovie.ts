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
  

}
