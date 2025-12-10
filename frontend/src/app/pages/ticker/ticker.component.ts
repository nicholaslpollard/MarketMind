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

  symbol: string = '';
  articles: any[] = [];

  sentiment = {
    positive: 0,
    neutral: 0,
    negative: 0
  };

  price: number | null = null;
  latestArticle: any = null;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private watchlistService: WatchlistService
  ) {}

  ngOnInit() {
    this.symbol = this.route.snapshot.paramMap.get('symbol')!.toUpperCase();
    this.loadNews();
    this.loadPrice();
  }

  loadNews() {
    this.newsService.searchNews(this.symbol).subscribe(res => {
      this.articles = res.articles || [];
      this.sentiment = res.sentiment || this.sentiment;

      if (this.articles.length > 0) {
        this.latestArticle = this.articles[0];
      }
    });
  }

  loadPrice() {
    this.watchlistService.getPrice(this.symbol).subscribe({
      next: (res) => {
        this.price = res.price;
      },
      error: () => {
        this.price = null;
      }
    });
  }
}
