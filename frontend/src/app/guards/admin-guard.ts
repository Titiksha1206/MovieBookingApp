import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NotificationService } from '../services/notification-service';

@Injectable({
  providedIn: 'root',
})
export class adminGuard implements CanActivate {
  constructor(
    private router: Router,
    private notificationService: NotificationService,
  ) {}

  canActivate(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');

      // ✅ Allow access for ADMIN
      if (token && userRole === 'ADMIN') {
        return true;
      }

      // ✅ If logged in but not ADMIN
      if (token && userRole === 'USER') {
        this.notificationService.error('You do not have admin access. Redirecting to user panel.');
        setTimeout(() => {
          this.router.navigate(['/user/view/Movies']);
        }, 1500);
        return false;
      }
    }

    // ✅ Not logged in
    this.notificationService.error('Please login to access admin panel.');
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
    return false;
  }
}
