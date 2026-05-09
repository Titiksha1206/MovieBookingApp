import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  isLoggedIn: boolean = false;
  userName: string = 'John Doe';
  userRole: string = 'ADMIN';
  showLogoutPopup: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (user != null) {
        this.isLoggedIn = true;
        this.userName = user.username;
        this.userRole = user.userRole;
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    this.authService.setUser(null);
    this.notificationService.success('Logout successful');
    this.router.navigate(['/']);
  }
}
