import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WatchlistService } from '../../core/services/watchlist.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent {

  watchlist: any[] = []; // list of watchlist items

  constructor(
    private router: Router, // router for navigation
    private watchlistService: WatchlistService // service for watchlist API
  ) {}

  ngOnInit() {
    this.load(); // load watchlist on page load
  }

  load() {
    this.watchlistService.getFullWatchlist().subscribe({
      next: (data) => this.watchlist = data, // store response
      error: (err) => console.error(err) // log error
    });
  }

  openTicker(symbol: string) {
    this.router.navigate(['/ticker', symbol]); // navigate to ticker page
  }

  deleteItem(symbol: string, event: Event) {
    event.stopPropagation(); // prevent card click from triggering navigation
    this.watchlistService.removeFromWatchlist(symbol).subscribe({
      next: () => this.load(), // reload watchlist after deletion
      error: (err) => console.error(err) // log error
    });
  }
}
