import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NotificationService } from '../services/notification-service';

@Injectable({
  providedIn: 'root'
})
export class userGuard implements CanActivate {
  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  canActivate(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      
      console.log('UserGuard - Token exists:', !!token, 'Role:', userRole);
      
      // ✅ Allow access for USER
      if (token && userRole === 'USER') {
        return true;
      }
      
      // ✅ If logged in but not USER (i.e., ADMIN)
      if (token && userRole === 'ADMIN') {
        console.log('Admin trying to access user page, redirecting...');
        this.notificationService.warning('Admins cannot access user pages. Redirecting to admin panel.');
        setTimeout(() => {
          this.router.navigate(['/admin/view/Movies']);
        }, 1500);
        return false;
      }
    }
    
    // ✅ Not logged in – save return URL and redirect to login
    console.log('User not logged in, redirecting to login');
    localStorage.setItem('returnUrl', this.router.url);
    this.notificationService.error('Please login to continue.');
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
    return false;
  }
}