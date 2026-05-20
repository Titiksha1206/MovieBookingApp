import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-registration',
  standalone: false,
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration implements OnInit {
  form!: FormGroup;
  isSubmitting = false;
  constructor(
    private builder: FormBuilder,
    private authSevice: AuthService,
    private router: Router,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.form = this.builder.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
            Validators.pattern(/^[a-zA-Z0-9._]+$/),
          ],
        ],
        email: ['', [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
        mobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
        userRole: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator },
    );
  }

  get username() {
    return this.form.get('username')!;
  }

  get email() {
    return this.form.get('email')!;
  }

  get password() {
    return this.form.get('password')!;
  }

  get confirmPassword() {
    return this.form.get('confirmPassword')!;
  }

  get mobileNumber() {
    return this.form.get('mobileNumber')!;
  }

  get role() {
    return this.form.get('userRole')!;
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password === confirmPassword) {
      if (confirmPassword.length > 0) form.get('confirmPassword')?.setErrors(null);
      else form.get('confirmPassword')?.setErrors({ required: true });
    } else {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
    }
  }

  register() {
    if (this.form.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    this.authSevice.registerUser(this.form.value).subscribe({
      next: () => {
        this.notificationService.success('Registration successful');
        this.router.navigate(['/login']);
        this.isSubmitting = false;
      },
      error: (err) => {
        let errorMessage = 'Registration failed. Please try again.';
        this.isSubmitting = false;

        // ✅ Parse error response
        if (err.error) {
          if (typeof err.error === 'string') {
            errorMessage = err.error;
          } else if (err.error.message) {
            errorMessage = err.error.message;
          } else if (err.error.error?.message) {
            errorMessage = err.error.error.message;
          }
        }

        // Handle specific HTTP status codes
        if (err.status === 409) {
          errorMessage = 'Username already exists. Please choose another.';
        } else if (err.status === 400) {
          errorMessage = 'Invalid input. Please check all fields.';
        } else if (err.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }

        this.notificationService.error(errorMessage);
      },
    });
  }
}
