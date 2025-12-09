import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMsg: string = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.errorMsg = '';

    this.auth.login(this.email, this.password).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.errorMsg = err.error?.message || 'Invalid email or password';
      }
    });
  }
}
