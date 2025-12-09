// src/app/core/services/news.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SentimentSummary {
  positive: number;
  neutral: number;
  negative: number;
}

export interface Article {
  title: string;
  article_url: string;
  published_utc: string;
  insights?: {
    sentiment: string;
  }[];
}

export interface NewsResponse {
  ticker: string;
  sentiment: SentimentSummary;
  articles: Article[];
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = '/api/news';

  constructor(private http: HttpClient) {}

  searchNews(ticker: string): Observable<NewsResponse> {
    return this.http.get<NewsResponse>(`${this.apiUrl}/${ticker}`);
  }
}
