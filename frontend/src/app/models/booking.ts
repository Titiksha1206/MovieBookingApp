
import { Movie } from "./movie"; 
import { User } from "./user"

export interface Booking {
  bookingId: number;
  seatCount?: number;
  totalCost: number;
  status: string;
  movie: Movie;
  user: User;
  seats: any[]; 
  showtime: any;
}
