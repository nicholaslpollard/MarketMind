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
  loggedIn = false; // login state
  userEmail: string | null = null; // displayed email

  private sub = new Subscription(); // subscription container

  constructor(
    private authService: AuthService, // auth service
    private router: Router // router service
  ) {}

  ngOnInit(): void {

    // watch login status updates
    this.sub.add(
      this.authService.loginStatus$.subscribe(status => {
        this.loggedIn = status;
      })
    );

    // watch email changes
    this.sub.add(
      this.authService.userEmail$.subscribe(email => {
        this.userEmail = email;
      })
    );

    // set initial logged-in state
    this.loggedIn = this.authService.isLoggedIn();
    this.authService.ensureEmailLoaded(); // restore email if needed

    // update navbar state after route changes
    this.sub.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.loggedIn = this.authService.isLoggedIn();
        }
      })
    );
  }

  goHome() {
    // route based on auth status
    if (this.loggedIn) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }

  logout(): void {
    this.authService.logout(); // clear session
    this.router.navigate(['/login']); // redirect to login
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe(); // clean up subscriptions
  }
}
