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

  query = ''; // search input
  latest: any = null; // latest article
  sentiment: any = null; // sentiment summary

  watchlist: any[] = []; // stored watchlist items

  searchError: string | null = null; // search error message

  constructor(
    private newsService: NewsService, // news API service
    private watchlistService: WatchlistService, // watchlist API service
    private router: Router // router navigation
  ) {}

  ngOnInit() {
    this.resetSearchState(); // clear UI state
    this.loadWatchlist(); // load watchlist on init
  }

  resetSearchState() {
    this.query = ''; // reset search query
    this.latest = null; // clear latest article
    this.sentiment = null; // clear sentiment
    this.searchError = null; // clear error
  }

  clearSearch() {
    this.resetSearchState(); // wrapper to reset state
  }

  loadWatchlist() {
    this.watchlistService.getFullWatchlist().subscribe({
      next: (data) => this.watchlist = data, // store list data
      error: (err) => console.error(err) // log errors
    });
  }

  search() {
    this.searchError = null; // clear previous errors
    this.latest = null; // clear results
    this.sentiment = null; // clear results

    if (!this.query.trim()) {
      this.searchError = 'Invalid Ticker Symbol'; // validate input
      return;
    }

    this.newsService.searchNews(this.query.toUpperCase()).subscribe({
      next: (res) => {
        if (!res.articles || res.articles.length === 0) {
          this.searchError = 'Invalid Ticker Symbol'; // handle bad input
          return;
        }

        this.latest = res.articles[0]; // store first article
        this.sentiment = res.sentiment; // store sentiment summary
      },
      error: () => {
        this.searchError = 'Invalid Ticker Symbol'; // catch errors
      }
    });
  }

  addToWatchlist(ticker: string) {
    this.watchlistService.addToWatchlist(ticker).subscribe({
      next: () => this.loadWatchlist(), // refresh list
      error: (err) => console.error(err) // log failure
    });
  }

  openTicker(symbol: string) {
    this.router.navigate(['/ticker', symbol]); // navigate to ticker page
  }
}
