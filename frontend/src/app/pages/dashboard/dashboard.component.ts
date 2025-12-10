import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NewsService } from '../../core/services/news.service';
import { WatchlistService } from '../../core/services/watchlist.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  query = '';
  latest: any = null;
  sentiment: any = null;

  watchlist: any[] = [];

  searchError: string | null = null;

  constructor(
    private newsService: NewsService,
    private watchlistService: WatchlistService,
    private router: Router
  ) {}

  ngOnInit() {
    this.resetSearchState();
    this.loadWatchlist();
  }

  resetSearchState() {
    this.query = '';
    this.latest = null;
    this.sentiment = null;
    this.searchError = null;
  }

  clearSearch() {
    this.resetSearchState();
  }

  loadWatchlist() {
    this.watchlistService.getFullWatchlist().subscribe({
      next: (data) => this.watchlist = data,
      error: (err) => console.error(err)
    });
  }

  search() {
    this.searchError = null;
    this.latest = null;
    this.sentiment = null;

    if (!this.query.trim()) {
      this.searchError = 'Invalid Ticker Symbol';
      return;
    }

    this.newsService.searchNews(this.query.toUpperCase()).subscribe({
      next: (res) => {
        if (!res.articles || res.articles.length === 0) {
          this.searchError = 'Invalid Ticker Symbol';
          return;
        }

        this.latest = res.articles[0];
        this.sentiment = res.sentiment;
      },
      error: () => {
        this.searchError = 'Invalid Ticker Symbol';
      }
    });
  }

  addToWatchlist(ticker: string) {
    this.watchlistService.addToWatchlist(ticker).subscribe({
      next: () => this.loadWatchlist(),
      error: (err) => console.error(err)
    });
  }

  openTicker(symbol: string) {
    this.router.navigate(['/ticker', symbol]);
  }
}
