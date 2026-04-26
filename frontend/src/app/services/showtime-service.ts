import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Showtime } from '../models/showtime';


@Injectable({
  providedIn: 'root'
})
export class ShowtimeService {

  private baseUrl = "http://localhost:8080/api/showtime";

  constructor(private http: HttpClient) {}

  // POST /api/showtime/{movieId}
  addShowtime(movieId: number, showtime: Showtime): Observable<Showtime> {
    return this.http.post<Showtime>(`${this.baseUrl}/${movieId}`, showtime);
  }

  // PUT /api/showtime/{showId}
  updateShowtime(showId: number, showtime: any): Observable<Showtime> {
    return this.http.put<Showtime>(`${this.baseUrl}/${showId}`, showtime);
  }

  // GET /api/showtime
  getAllShowtimes(): Observable<Showtime[]> {
    return this.http.get<Showtime[]>(`${this.baseUrl}`);
  }

  // GET /api/showtime/{showId}
  getShowtimeById(showId: number): Observable<Showtime> {
    return this.http.get<Showtime>(`${this.baseUrl}/${showId}`);
  }

  // GET /api/showtime/movie/{movieId}/{date}
  getShowtimesByDate(movieId: number, date: string): Observable<Showtime[]> {
    return this.http.get<Showtime[]>(`${this.baseUrl}/movie/${movieId}/${date}`);
  }

  // DELETE /api/showtime/{showId}
  deleteShowtime(showId: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/${showId}`);
  }

  getShowtimesByMovie(movieId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/movie/${movieId}`);
  }
}