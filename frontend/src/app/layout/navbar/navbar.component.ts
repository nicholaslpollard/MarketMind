import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  loggedIn = false;
  userEmail: string | null = null;

  private sub = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    // Listen to login status changes
    this.sub.add(
      this.authService.loginStatus$.subscribe(status => {
        this.loggedIn = status;
      })
    );

    // Listen for email changes
    this.sub.add(
      this.authService.userEmail$.subscribe(email => {
        this.userEmail = email;
      })
    );

    // Set initial navbar state
    this.loggedIn = this.authService.isLoggedIn();
    this.authService.ensureEmailLoaded();

    // Update when navigation occurs
    this.sub.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.loggedIn = this.authService.isLoggedIn();
        }
      })
    );
  }

  // NEW: Handle brand click
  goHome() {
    if (this.loggedIn) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
