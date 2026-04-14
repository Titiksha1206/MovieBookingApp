import { Component, OnInit } from '@angular/core';
import { Movie } from '../../models/movie';
import { BookingService } from '../../services/booking-service';
import { MovieService } from '../../services/movie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { Booking } from '../../models/booking';

@Component({
  selector: 'app-userbookingmovie',
  standalone: false,
  templateUrl: './userbookingmovie.html',
  styleUrl: './userbookingmovie.css',
})
export class Userbookingmovie implements OnInit{
   cost : any =  {
     '' : 0,
    'Balcony' : 200,
    'Middle' : 150,
    'Economy' : 100
   }

   seats : number = 1;
   movie!: Movie;
   userId! : number;
   movieId! : number;
   seatType : string = "";
   totalCost : number = 0;
   perPerson : number = 0;
   

  constructor(
    private bookingService : BookingService,
    private movieService : MovieService,
    private router : Router,
    private activatedRoute : ActivatedRoute,
    private authService : AuthService,
      ) { }


  ngOnInit(): void {
      this.activatedRoute.queryParams.subscribe(queryParams => {
        this.userId =  Number(localStorage.getItem('userId'));
        this.movieId = queryParams['movieId'];
        this.loadMovie();
      })
  }

  loadMovie() {
    this.movieService.getMovieById(this.movieId).subscribe({
      next : (data)=> {
      this.movie = data;
      },
      error : (err)=> {
        console.log(err);
        alert("Loading Movie failed");
      }
    })
  }


  updateTotalCost(){
    this.perPerson = this.cost[this.seatType];
    this.totalCost = this.seats *  this.cost[this.seatType];
  }

  registerBooking() {

       let booking: any = {
        user : {"userId" :  this.userId },
        movie : { "movieId" : this.movieId},
        seatCount : this.seats, 
        totalCost : this.totalCost
      };
      console.log(JSON.stringify(booking));
       this.bookingService.addBooking(booking,this.movieId,this.userId).subscribe({
        next : (data) => {
        //this.toastr.success("Booking Successfull", "Successfull");
        console.log(JSON.stringify(data));
        this.router.navigate(['/user/view/Mybookings']);
        },
        error : (err) => {
        alert("Booking Failed");
        }
      })
  }

}
