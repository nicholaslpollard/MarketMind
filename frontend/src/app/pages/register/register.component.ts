// src/app/pages/register/register.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email = '';
  password = '';
  successMsg = '';
  errorMsg = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  register(): void {
    this.errorMsg = '';
    this.successMsg = '';
    this.loading = true;

    const email = this.email.trim();
    const password = this.password;

    if (!email || !password) {
      this.errorMsg = 'Email and password are required.';
      this.loading = false;
      return;
    }

    this.auth.register(email, password).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMsg = res?.message || 'Registration successful. You can now log in.';
        // Optionally auto-redirect after a short delay
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Registration failed.';
      }
    });
  }
}
