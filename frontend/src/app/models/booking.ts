
import { Movie } from "./movie"; 
import { User } from "./user"

export interface Booking {
  bookingId: number;
  seatCount?: number;
  totalCost: number;
  movie: Movie;
  user: User;
}
