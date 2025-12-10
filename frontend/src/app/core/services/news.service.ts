// src/app/core/services/news.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SentimentSummary {
  positive: number; // positive count
  neutral: number; // neutral count
  negative: number; // negative count
}

export interface Article {
  title: string; // article title
  article_url: string; // link to article
  published_utc: string; // publish timestamp
  insights?: {
    sentiment: string; // sentiment label
  }[];
}

export interface NewsResponse {
  ticker: string; // ticker symbol
  sentiment: SentimentSummary; // sentiment totals
  articles: Article[]; // list of articles
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = '/api/news'; // backend news endpoint

  constructor(private http: HttpClient) {} // inject http client

  searchNews(ticker: string): Observable<NewsResponse> {
    return this.http.get<NewsResponse>(`${this.apiUrl}/${ticker}`); // fetch news data
  }
}
