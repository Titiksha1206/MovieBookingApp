import { Seatcategory } from "./seatcategory";
export interface Showtime {
  showtimeId     : number;
  theater        : string;
  showDate       : string;
  showTime       : string;
  totalSeats     : number;
  availableSeats : number;
  seatCategories : Seatcategory[]; 
}
