import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  isLoggedIn: boolean = false;
  private userSub!: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to auth state changes (login/logout)
    this.userSub = this.authService.user$.subscribe((user) => {
      this.isLoggedIn = !!user;
    });
  }

  ngOnDestroy(): void {
    if (this.userSub) this.userSub.unsubscribe();
  }

  checkLogin(): void {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      this.isLoggedIn = !!token;
    } else {
      this.isLoggedIn = false;
    }
  }
}
