import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/user';
import { Login } from '../models/login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
   private USER_KEY = 'userId';

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private httpClient : HttpClient) { }
  
  public baseUrl = "";
  registerUser(user : User) : Observable<User> {
     return this.httpClient.post<User>(this.baseUrl  + "/register", user);
  }

  loginUser(loginDto : Login) : Observable<any> {
      return this.httpClient.post<any>(this.baseUrl + "/login",  loginDto);
  }

  setUser(user : User | null): void{
    this.userSubject.next(user);
  }

}
