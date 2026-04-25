import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject  } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/user';
import { Login } from '../models/login';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
   private USER_KEY = 'userId';

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private httpClient : HttpClient, @Inject(PLATFORM_ID) private platformId: Object  // ✅ inject platform
  ) {
    // ✅ Only access localStorage in the browser — not during SSR
    if (isPlatformBrowser(this.platformId)) {
      const userId   = localStorage.getItem('userId');
      const userRole = localStorage.getItem('userRole');
      const username = localStorage.getItem('username');

      if (userId && userRole && username) {
        this.userSubject.next({ userId: parseInt(userId), userRole, username });
      }
    }
  }
  
  public baseUrl = "http://localhost:8080/api/user";
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
