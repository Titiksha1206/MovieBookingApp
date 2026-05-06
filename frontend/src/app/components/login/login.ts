import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { User } from '../../models/user';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  login(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const loginDto = {
      username: form.value.username,
      password: form.value.password,
    };

    // Clear old auth state
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');

    this.errorMessage = '';

    this.authService.loginUser(loginDto).subscribe({
      next: (data) => {
        // Store auth data
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', String(data.userId));
        localStorage.setItem('userRole', data.userRole);
        localStorage.setItem('username', data.username);

        // Sync auth state
        this.authService.setUser({
          userId: data.userId,
          userRole: data.userRole,
          username: data.username,
        });

        form.resetForm();

        // ✅ Check for saved return URL (from seat selection or any other page)
        const returnUrl = localStorage.getItem('returnUrl');
        if (returnUrl) {
          localStorage.removeItem('returnUrl'); // clear after use
          this.router.navigateByUrl(returnUrl);
        } else {
          // Default role‑based redirect
          if (data.userRole === 'ADMIN') {
            this.router.navigate(['/admin/view/Movies']);
          } else {
            this.router.navigate(['/user/view/Movies']);
          }
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Invalid username or password. Login Failed.';
        alert(this.errorMessage);
      },
    });
  }
}
