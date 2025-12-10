import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '../../core/services/news.service';
import { WatchlistService } from '../../core/services/watchlist.service';

@Component({
  selector: 'app-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.css']
})
export class TickerComponent implements OnInit {

  symbol: string = ''; // ticker symbol
  articles: any[] = []; // list of articles

  sentiment = {
    positive: 0, // positive count
    neutral: 0, // neutral count
    negative: 0 // negative count
  };

  price: number | null = null; // last price value
  latestArticle: any = null; // latest article

  constructor(
    private route: ActivatedRoute, // route parameters
    private newsService: NewsService, // news API service
    private watchlistService: WatchlistService // price API service
  ) {}

  ngOnInit() {
    this.symbol = this.route.snapshot.paramMap.get('symbol')!.toUpperCase(); // get ticker from route
    this.loadNews(); // load headlines
    this.loadPrice(); // load pricing
  }

  loadNews() {
    this.newsService.searchNews(this.symbol).subscribe(res => {
      this.articles = res.articles || []; // store articles
      this.sentiment = res.sentiment || this.sentiment; // store sentiment

      if (this.articles.length > 0) {
        this.latestArticle = this.articles[0]; // first article is latest
      }
    });
  }

  loadPrice() {
    this.watchlistService.getPrice(this.symbol).subscribe({
      next: (res) => {
        this.price = res.price; // store price
      },
      error: () => {
        this.price = null; // fallback if unavailable
      }
    });
  }
}
