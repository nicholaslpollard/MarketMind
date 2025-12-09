// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = '/api/auth';  // uses proxy.conf.json → http://localhost:5000/api/auth

  constructor(private http: HttpClient) {}

  /**
   * Register a new user
   */
  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password });
  }

  /**
   * Login and store JWT
   */
  login(email: string, password: string): Observable<any> {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((res) => {
          if (res && res.token) {
            localStorage.setItem('token', res.token);
          }
        })
      );
  }

  /**
   * Get the stored token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Simple logged-in check
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Clear auth state
   */
  logout(): void {
    localStorage.removeItem('token');
  }
}
