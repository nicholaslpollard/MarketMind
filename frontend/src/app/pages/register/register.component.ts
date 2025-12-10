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
  email = ''; // input email
  password = ''; // input password
  successMsg = ''; // success message text
  errorMsg = ''; // error message text
  loading = false; // loading flag

  constructor(
    private auth: AuthService, // auth API service
    private router: Router // router navigation
  ) {}

  register(): void {
    this.errorMsg = ''; // clear error
    this.successMsg = ''; // clear success
    this.loading = true; // show loading state

    const email = this.email.trim(); // clean email input
    const password = this.password; // read password

    if (!email || !password) {
      this.errorMsg = 'Email and password are required.'; // validate fields
      this.loading = false;
      return;
    }

    this.auth.register(email, password).subscribe({
      next: (res) => {
        this.loading = false; // stop loading
        this.successMsg = res?.message || 'Registration successful. You can now log in.'; // success text

        // optional redirect delay
        setTimeout(() => {
          this.router.navigate(['/login']); // navigate to login
        }, 1200);
      },
      error: (err) => {
        this.loading = false; // stop loading
        this.errorMsg = err?.error?.message || 'Registration failed.'; // error text
      }
    });
  }
}
