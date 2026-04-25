import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movie } from '../models/movie';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
   public baseUrl = "http://localhost:8080/api/movie";

  constructor(private httpClient : HttpClient) { }

  addMovie(movie : Movie) : Observable<Movie> {
     return this.httpClient.post<Movie>(this.baseUrl , movie);
  }

  updateMovie(movie:Movie) {
    return this.httpClient.put(this.baseUrl + "/" + movie.movieId ,movie);
  }

  getAllMovies() : Observable<Movie[]> {
    return this.httpClient.get<Movie[]>(this.baseUrl);
  }

  getMovieById(id : number) : Observable<Movie>{
    return this.httpClient.get<Movie>(this.baseUrl + "/" + id);
  }

  deleteMovie(id : number) : Observable<boolean>{
    return this.httpClient.delete<boolean>(this.baseUrl + "/" + id);
  }

}
