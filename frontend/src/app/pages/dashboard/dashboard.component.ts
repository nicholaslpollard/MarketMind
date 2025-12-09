// src/app/pages/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { NewsService, NewsResponse } from '../../core/services/news.service';
import { WatchlistService, WatchlistSummaryItem } from '../../core/services/watchlist.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  query = '';
  loading = false;
  errorMsg = '';
  result: NewsResponse | null = null;

  // ★ NEW FOR STEP 4 ★
  watchlist: WatchlistSummaryItem[] = [];
  watchlistLoading = false;

  constructor(
    private newsService: NewsService,
    private watchlistService: WatchlistService
  ) {}

  ngOnInit(): void {
    this.loadWatchlistSummary();
  }

  // ★ Load watchlist overview on page load
  loadWatchlistSummary(): void {
    this.watchlistLoading = true;
    this.watchlistService.getFullWatchlist().subscribe({
      next: (data) => {
        this.watchlist = data;
        this.watchlistLoading = false;
      },
      error: () => {
        this.watchlistLoading = false;
      }
    });
  }

  // Search for ticker news
  search(): void {
    this.errorMsg = '';
    this.result = null;

    const ticker = this.query.trim().toUpperCase();
    if (!ticker) return;

    this.loading = true;

    this.newsService.searchNews(ticker).subscribe({
      next: (data) => {
        this.result = data;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'No news found or server error.';
        this.loading = false;
      }
    });
  }

  // ★ Click watchlist tile → search that ticker
  openTicker(ticker: string): void {
    this.query = ticker;
    this.search();
  }

  // Add to watchlist
  addToWatchlist(): void {
    if (!this.result) return;

    this.watchlistService.addToWatchlist(this.result.ticker).subscribe({
      next: () => {
        alert(`${this.result!.ticker} added to your watchlist!`);
        this.loadWatchlistSummary(); // refresh
      },
      error: () => alert('Could not add to watchlist.')
    });
  }

  // Sentiment helper
  getSentimentFromArticle(article: any): string {
    if (!article.insights || article.insights.length === 0) return 'neutral';
    return article.insights[0].sentiment || 'neutral';
  }
}
