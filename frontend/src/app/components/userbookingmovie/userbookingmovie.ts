import { Component, OnInit } from '@angular/core';
import { Movie } from '../../models/movie';
import { BookingService } from '../../services/booking-service';
import { MovieService } from '../../services/movie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { Booking } from '../../models/booking';
import { ShowtimeService } from '../../services/showtime-service';

@Component({
  selector: 'app-userbookingmovie',
  standalone: false,
  templateUrl: './userbookingmovie.html',
  styleUrl: './userbookingmovie.css',
})
export class Userbookingmovie implements OnInit{
   movie!: Movie;
   userId! : number;
   movieId! : number;
   
  // ── Date Strip ──
  dates            : Date[]  = [];
  selectedDateIndex: number  = 0;
  selectedDate     : Date    = new Date();

  // ── Showtimes ──
  showtimes        : any[]   = [];
  selectedShowtime : any     = null;

  // ── Seat Selection ──
  selectedCategory : any     = null;
  seats            : number  = 1;
  totalCost        : number  = 0;

  constructor(
    private bookingService : BookingService,
    private movieService : MovieService,
    private router : Router,
    private activatedRoute : ActivatedRoute,
    private authService : AuthService,
    private showtimeService : ShowtimeService
      ) { }


  ngOnInit(): void {
    this.generateDates();
      this.activatedRoute.queryParams.subscribe(queryParams => {
        this.userId =  Number(localStorage.getItem('userId'));
        this.movieId = queryParams['movieId'];
        this.loadMovie();
        this.loadShowtimes();
      })
  }

  generateDates(): void {
    this.dates = []; 
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      this.dates.push(new Date(d));
    }
    this.selectedDate = this.dates[0];
    this.selectedDateIndex = 0;
  }

  selectDate(index: number): void {
    this.selectedDateIndex = index;
    this.selectedDate      = this.dates[index];
    this.selectedShowtime  = null;
    this.selectedCategory  = null;
    this.totalCost         = 0;
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
loadShowtimes(): void {
    this.showtimeService.getShowtimesByMovie(this.movieId).subscribe({
      next : (data: any[]) => this.showtimes = data,
      error: (err: any)    => console.error(err)
    });
  }

  get filteredShowtimes(): any[] {
  const dateStr = this.formatDate(this.selectedDate);
  console.log('Filtering for date:', dateStr);           // ✅
  console.log('All showtimes:', JSON.stringify(this.showtimes)); // ✅
  return this.showtimes.filter((s: any) => s.showDate === dateStr);
}

  selectShowtime(showtime: any): void {
    this.selectedShowtime = showtime;
    this.selectedCategory = null;
    this.totalCost        = 0;
  }

  selectCategory(cat: any): void {
    this.selectedCategory = cat;
    this.updateTotalCost();
  }

  updateTotalCost(): void {
    if (this.selectedCategory && this.seats > 0) {
      this.totalCost = this.selectedCategory.price * this.seats;
    }
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
 formatDate(date: Date): string {
    const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`; 
  }

  
  getMonthName(date: Date): string {
    return date.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase();
  }

  getDayName(date: Date): string {
    return date.toLocaleDateString('en-IN', { weekday: 'short' });
  }

  getAvailabilityDot(available: number, total: number): string {
    const pct = available / total;
    if (pct > 0.5) return 'bg-green-400';
    if (pct > 0.2) return 'bg-yellow-400';
    return 'bg-red-400';
  }

  getAvailabilityLabel(available: number, total: number): string {
    const pct = available / total;
    if (pct > 0.5) return 'Available';
    if (pct > 0.2) return 'Filling fast';
    return 'Almost full';
  }

  getAvailabilityColor(available: number, total: number): string {
    const pct = available / total;
    if (pct > 0.5) return 'text-green-400';
    if (pct > 0.2) return 'text-yellow-400';
    return 'text-red-400';
  }

  getCategoryIcon(name: string): string {
    const icons: any = {
      'Classic'  : '🪑',
      'Prime'    : '⭐',
      'Premium'  : '💎',
      'Recliners': '🛋'
    };
    return icons[name] || '💺';
  }
  get groupedShowtimes(): { theater: string; shows: any[] }[] {
  const dateStr = this.formatDate(this.selectedDate);
  const filtered = this.showtimes.filter((s: any) => s.showDate === dateStr);

  const groups: { [key: string]: any[] } = {};
  filtered.forEach((s: any) => {
    if (!groups[s.theater]) groups[s.theater] = [];
    groups[s.theater].push(s);
  });

  return Object.keys(groups).map(theater => ({
    theater,
    shows: groups[theater].sort((a, b) =>
      a.showTime.localeCompare(b.showTime)) // ✅ sort by time
  }));
}
}
