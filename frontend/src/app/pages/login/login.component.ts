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
  email = ''; // input email
  password = ''; // input password
  errorMsg = ''; // error message display
  loading = false; // loading flag

  constructor(
    private auth: AuthService, // auth service
    private router: Router // router navigation
  ) {}

  login(): void {
    this.errorMsg = ''; // clear previous errors
    this.loading = true; // show loading state

    const email = this.email.trim(); // clean email
    const password = this.password; // read password

    if (!email || !password) {
      this.errorMsg = 'Email and password are required.'; // validation
      this.loading = false;
      return;
    }

    this.auth.login(email, password).subscribe({
      next: () => {
        this.loading = false; // stop loading
        this.router.navigate(['/dashboard']); // redirect on success
      },
      error: (err) => {
        this.loading = false; // stop loading
        this.errorMsg = err?.error?.message || 'Invalid email or password.'; // show error
      }
    });
  }
}
