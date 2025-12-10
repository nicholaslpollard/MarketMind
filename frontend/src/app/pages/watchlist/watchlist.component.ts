import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WatchlistService } from '../../core/services/watchlist.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent {

  watchlist: any[] = [];

  constructor(
    private router: Router,
    private watchlistService: WatchlistService
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.watchlistService.getFullWatchlist().subscribe({
      next: (data) => this.watchlist = data,
      error: (err) => console.error(err)
    });
  }

  openTicker(symbol: string) {
    this.router.navigate(['/ticker', symbol]);
  }

  deleteItem(symbol: string, event: Event) {
    event.stopPropagation();  // prevent card click navigation
    this.watchlistService.removeFromWatchlist(symbol).subscribe({
      next: () => this.load(),
      error: (err) => console.error(err)
    });
  }
}
