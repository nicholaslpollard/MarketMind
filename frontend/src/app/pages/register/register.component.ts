import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  email: string = '';
  password: string = '';
  successMsg: string = '';
  errorMsg: string = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  register(): void {
    this.successMsg = '';
    this.errorMsg = '';

    this.auth.register(this.email, this.password).subscribe({
      next: () => {
        this.successMsg = 'Registration successful! Redirecting...';
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (err: any) => {
        this.errorMsg = err.error?.message || 'Registration failed';
      }
    });
  }
}
