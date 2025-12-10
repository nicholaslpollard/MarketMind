// src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.errorMsg = '';
    this.loading = true;

    const email = this.email.trim();
    const password = this.password;

    if (!email || !password) {
      this.errorMsg = 'Email and password are required.';
      this.loading = false;
      return;
    }

    this.auth.login(email, password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Invalid email or password.';
      }
    });
  }
}
