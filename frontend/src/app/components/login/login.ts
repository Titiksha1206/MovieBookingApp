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
  
  // Optional: show an error message in UI instead of only alert()
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  login(form: NgForm): void {
    // ✅ prevent submit when invalid (extra safety; button already disabled)
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const loginDto: any = {
      username: form.value.username,
      password: form.value.password
    };

    // ✅ clear old auth state before new login attempt
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');

    this.errorMessage = '';

    this.authService.loginUser(loginDto).subscribe({
      next: (data) => {
        // Keep your existing behaviour
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', String(data.userId));  
        localStorage.setItem('userRole', data.userRole);
        localStorage.setItem('username', data.username);

        // ✅ keep app state in sync (you already do this)
        this.authService.setUser({ userId: data.userId, userRole: data.userRole, username: data.username });

        // Optional UX: reset form after success
        form.resetForm();
        // ✅ Redirect based on role
  if (data.userRole === 'ADMIN') {
    this.router.navigate(['/admin/view/Movies']);
  } else {
    this.router.navigate(['/user/view/Movies']);
  }
        // this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Invalid username or password. Login Failed.';
        alert(this.errorMessage);
      }
    });
  }
}
