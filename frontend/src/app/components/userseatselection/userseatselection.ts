import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShowtimeService } from '../../services/showtime-service';
import { BookingService } from '../../services/booking-service';

@Component({
  selector: 'app-userseatselection',
  standalone: false,
  templateUrl: './userseatselection.html',
  styleUrl: './userseatselection.css',
})
export class Userseatselection  implements OnInit {
  showtimeId   : number = 0;
  movieId      : number = 0;
  userId       : number = 0;
  showtime     : any    = null;
  seatCategories: any[] = [];
  selectedSeats : any[] = [];
  loadingSeats  : boolean = true;
  totalCost     : number = 0;

  constructor(
    private showtimeService : ShowtimeService,
    private bookingService  : BookingService,
    private activatedRoute  : ActivatedRoute,
    private router          : Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      console.log('Query params:', params); 
      this.showtimeId = Number(params['showtimeId']);
      this.movieId    = Number(params['movieId']);
      this.userId     = Number(localStorage.getItem('userId'));
      this.loadSeats();
    });
  }

  loadSeats(): void {
    this.loadingSeats = true;
    console.log('Loading seats for showtimeId:', this.showtimeId); // ✅

    this.showtimeService.getSeatsByShowtime(this.showtimeId).subscribe({
      next: (data: any[]) => {
         console.log('Seats response:', JSON.stringify(data)); // ✅
        this.seatCategories = data;
        this.loadingSeats   = false;
        console.log('Seat categories:', JSON.stringify(data));
      },
      error: (err: any) => {
        console.error('Failed to load seats:', err);
        this.loadingSeats = false;
        alert('Failed to load seats');
      }
    });
  }

  toggleSeat(seat: any, category: any): void {
     if (seat.status === 'BOOKED') {
      return;
    }

    const idx = this.selectedSeats.findIndex(
      s => s.seatId === seat.seatId
    );

    if (idx > -1) {
      this.selectedSeats.splice(idx, 1);
    } else {
      this.selectedSeats.push({
        ...seat,
        price       : category.price,
        categoryName: category.name
      });
    }

    this.updateTotalCost();
  }

  isSeatSelected(seatId: number): boolean {
    return this.selectedSeats.some(s => s.seatId === seatId);
  }

  updateTotalCost(): void {
    this.totalCost = this.selectedSeats.reduce(
      (sum, s) => sum + s.price, 0
    );
  }

  getRows(seats: any[]): { rowLabel: string; seats: any[] }[] {
    const groups: { [key: string]: any[] } = {};
    seats.forEach(seat => {
      if (!groups[seat.rowLabel]) groups[seat.rowLabel] = [];
      groups[seat.rowLabel].push(seat);
    });
    return Object.keys(groups).sort().map(row => ({
      rowLabel: row,
      seats   : groups[row].sort((a, b) => a.seatNumber - b.seatNumber)
    }));
  }

  showAisle(seatNumber: number): boolean {
    return seatNumber === 4 || seatNumber === 7
        || seatNumber === 10 || seatNumber === 13;
  }

  registerBooking(): void {
    if (this.selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    const booking: any = {
      seatCount: this.selectedSeats.length,
      totalCost: this.totalCost,
      seatIds: this.selectedSeats.map(s => s.seatId) 
    };
    console.log("Booking Payload:", booking);

    this.bookingService.addBooking(
      booking, this.movieId, this.userId
    ).subscribe({
      next : () => this.router.navigate(['/user/view/Mybookings']),
      error: ()  => alert('Booking Failed')
    });
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

  goBack(): void {
    this.router.navigate(['/user/bookMovie'],
      { queryParams: { movieId: this.movieId } }
    );
  }
}

