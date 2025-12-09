// src/app/core/services/watchlist.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WatchlistSummaryItem {
  ticker: string;
  displayName: string;
  price: number | null;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  latest: {
    title: string;
    sentiment: string;
  } | null;
}

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private apiUrl = '/api/watchlist';

  constructor(private http: HttpClient) {}

  // Full watchlist overview
  getFullWatchlist(): Observable<WatchlistSummaryItem[]> {
    return this.http.get<WatchlistSummaryItem[]>(`${this.apiUrl}/full`);
  }

  // Add ticker
  addToWatchlist(ticker: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { ticker });
  }

  // Remove ticker
  removeFromWatchlist(ticker: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${ticker}`);
  }
}
