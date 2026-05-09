import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class userGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');

      // ✅ Allow access if user is logged in and role is USER
      if (token && userRole === 'CUSTOMER') {
        return true;
      }

      // ✅ If logged in but role is ADMIN, redirect to admin panel
      if (token && userRole === 'ADMIN') {
        this.router.navigate(['/admin/view/Movies']);
        return false;
      }
    }

    // ✅ Not logged in, save return URL and redirect to login
    localStorage.setItem('returnUrl', this.router.url);
    this.router.navigate(['/login']);
    return false;
  }
}
