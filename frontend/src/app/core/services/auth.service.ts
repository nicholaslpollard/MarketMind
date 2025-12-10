import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';

  private userEmailSource = new BehaviorSubject<string | null>(null);
  userEmail$ = this.userEmailSource.asObservable();

  private loginStatusSource = new BehaviorSubject<boolean>(this.hasToken());
  loginStatus$ = this.loginStatusSource.asObservable();

  constructor(private http: HttpClient) {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      this.userEmailSource.next(savedEmail);
    }
  }

  // Ensures navbar loads email instantly on refresh
  ensureEmailLoaded() {
    const email = localStorage.getItem('userEmail');
    if (email && !this.userEmailSource.value) {
      this.userEmailSource.next(email);
    }
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  login(email: string, password: string) {
    return this.http.post<any>('/api/auth/login', { email, password }).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        localStorage.setItem('userEmail', email);

        this.userEmailSource.next(email);
        this.loginStatusSource.next(true);
      })
    );
  }

  register(email: string, password: string) {
    return this.http.post<any>('/api/auth/register', { email, password }).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        localStorage.setItem('userEmail', email);

        this.userEmailSource.next(email);
        this.loginStatusSource.next(true);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('userEmail');

    this.userEmailSource.next(null);
    this.loginStatusSource.next(false);
  }

  isLoggedIn() {
    return this.hasToken();
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  fetchUserEmail() {
    return this.http.get<any>('/api/auth/me').pipe(
      tap(res => {
        if (res.email) {
          this.userEmailSource.next(res.email);
          localStorage.setItem('userEmail', res.email);
        }
      })
    );
  }

  changePassword(oldPassword: string, newPassword: string) {
    return this.http.post<any>('/api/auth/change-password', {
      oldPassword,
      newPassword
    });
  }

  deleteAccount() {
    return this.http.delete<any>('/api/auth/delete');
  }
}
