import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token'; // storage key for JWT

  private userEmailSource = new BehaviorSubject<string | null>(null); // email state
  userEmail$ = this.userEmailSource.asObservable(); // email observable

  private loginStatusSource = new BehaviorSubject<boolean>(this.hasToken()); // login state
  loginStatus$ = this.loginStatusSource.asObservable(); // login observable

  constructor(private http: HttpClient) {
    const savedEmail = localStorage.getItem('userEmail'); // load stored email
    if (savedEmail) {
      this.userEmailSource.next(savedEmail); // restore email state
    }
  }

  ensureEmailLoaded() {
    const email = localStorage.getItem('userEmail'); // read email from storage
    if (email && !this.userEmailSource.value) {
      this.userEmailSource.next(email); // update state on refresh
    }
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey); // check token existence
  }

  login(email: string, password: string) {
    return this.http.post<any>('/api/auth/login', { email, password }).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token); // store token
        localStorage.setItem('userEmail', email); // store email

        this.userEmailSource.next(email); // update email state
        this.loginStatusSource.next(true); // set logged in
      })
    );
  }

  register(email: string, password: string) {
    return this.http.post<any>('/api/auth/register', { email, password }).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token); // store token
        localStorage.setItem('userEmail', email); // store email

        this.userEmailSource.next(email); // update state
        this.loginStatusSource.next(true); // set logged in
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey); // remove token
    localStorage.removeItem('userEmail'); // remove email

    this.userEmailSource.next(null); // clear email state
    this.loginStatusSource.next(false); // set logged out
  }

  isLoggedIn() {
    return this.hasToken(); // convenience method
  }

  getToken() {
    return localStorage.getItem(this.tokenKey); // return JWT
  }

  fetchUserEmail() {
    return this.http.get<any>('/api/auth/me').pipe(
      tap(res => {
        if (res.email) {
          this.userEmailSource.next(res.email); // update email state
          localStorage.setItem('userEmail', res.email); // store email
        }
      })
    );
  }

  changePassword(oldPassword: string, newPassword: string) {
    return this.http.post<any>('/api/auth/change-password', {
      oldPassword,
      newPassword
    }); // call change password API
  }

  deleteAccount() {
    return this.http.delete<any>('/api/auth/delete'); // call delete account API
  }
}
