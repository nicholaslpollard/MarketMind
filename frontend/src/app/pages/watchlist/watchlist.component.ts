// src/app/pages/watchlist/watchlist.component.ts
import { Component, OnInit } from '@angular/core';
import { WatchlistService, WatchlistSummaryItem } from '../../core/services/watchlist.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  watchlist: WatchlistSummaryItem[] = [];
  loading = false;
  errorMsg = '';
  addTicker = '';

  constructor(private watchlistService: WatchlistService) {}

  ngOnInit(): void {
    this.loadWatchlist();
  }

  loadWatchlist(): void {
    this.loading = true;
    this.watchlistService.getFullWatchlist().subscribe({
      next: (data) => {
        this.watchlist = data;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Could not load watchlist.';
        this.loading = false;
      }
    });
  }

  addNewTicker(): void {
    const t = this.addTicker.trim().toUpperCase();
    if (!t) return;

    this.watchlistService.addToWatchlist(t).subscribe({
      next: () => {
        this.addTicker = '';
        this.loadWatchlist();
      },
      error: () => alert('Failed to add ticker.')
    });
  }

  remove(ticker: string): void {
    if (!confirm(`Remove ${ticker} from your watchlist?`)) return;

    this.watchlistService.removeFromWatchlist(ticker).subscribe({
      next: () => this.loadWatchlist(),
      error: () => alert('Failed to remove ticker.')
    });
  }
}
