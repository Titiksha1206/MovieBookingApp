import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Booking } from '../models/booking';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  public baseUrl = "";
  constructor(private httpClient : HttpClient) { }

  addBooking(booking : Booking,movieId:number,userId:number) : Observable<Booking> {
     return this.httpClient.post<Booking>(this.baseUrl + "/" + movieId + "/" + userId, booking);
  }

  getUserBookings(userId : number) : Observable<Booking[]> {
    return this.httpClient.get<Booking[]>(this.baseUrl + "/user/" + userId);
  }

  updateBooking(booking : Booking) : Observable<Booking> {
    return this.httpClient.put<Booking>(this.baseUrl + "/" + booking.bookingId , booking);
  }

  deleteBooking(id : number) : Observable<boolean>{
    return this.httpClient.delete<boolean>(this.baseUrl + "/" + id);
  }

  getAllBookings() : Observable<Booking[]>{
    return this.httpClient.get<Booking[]>(this.baseUrl);
  }

}
