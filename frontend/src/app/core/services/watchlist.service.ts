// src/app/core/services/watchlist.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WatchlistSummaryItem {
  ticker: string; // stock symbol
  displayName: string; // display name
  price: number | null; // last price
  sentiment: {
    positive: number; // positive count
    neutral: number; // neutral count
    negative: number; // negative count
  };
  latest: {
    title: string; // latest headline
    sentiment: string; // latest sentiment
  } | null;
}

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private apiUrl = '/api/watchlist'; // base endpoint

  constructor(private http: HttpClient) {} // inject HTTP client

  getFullWatchlist(): Observable<WatchlistSummaryItem[]> {
    return this.http.get<WatchlistSummaryItem[]>(`${this.apiUrl}/full`); // fetch overview
  }

  addToWatchlist(ticker: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { ticker }); // add ticker
  }

  removeFromWatchlist(ticker: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${ticker}`); // remove ticker
  }

  getPrice(ticker: string) {
    return this.http.get<{ ticker: string; price: number }>(
      `${this.apiUrl}/price/${ticker}` // fetch price for ticker
    );
  }
}
