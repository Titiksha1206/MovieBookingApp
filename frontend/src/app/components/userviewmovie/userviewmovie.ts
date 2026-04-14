import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userviewmovie',
  standalone: false,
  templateUrl: './userviewmovie.html',
  styleUrl: './userviewmovie.css',
})
export class Userviewmovie implements OnInit {
   movies : any[] = [];
  errorMessage : string = '';

  constructor(
    private movieService : MovieService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies() {
     this.movieService.getAllMovies().subscribe({
      next : (data) => {
        this.movies = data;
        console.log(JSON.stringify(data));
      } ,
      error : (err) => {
         console.log(err);
         alert("Failed to load Movies");
      }
     })
  }

  navigateToBooking(movieId : number) {
     this.router.navigate(['/user/bookMovie'], {queryParams:{movieId : movieId}});
  }
}
