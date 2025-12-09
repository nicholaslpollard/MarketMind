// controllers/newsController.js
const axios = require('axios');

const MASSIVE_BASE_URL = process.env.MASSIVE_BASE_URL || 'https://api.massive.com/v2';
const MASSIVE_API_KEY = process.env.MASSIVE_API_KEY;

exports.searchNews = async (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase();

    if (!MASSIVE_API_KEY) {
      return res.status(500).json({ message: "Missing Massive API Key" });
    }

    const url = `${MASSIVE_BASE_URL}/reference/news`;

    const params = {
      ticker,
      limit: 20,
      order: "desc",
      sort: "published_utc",
      apiKey: MASSIVE_API_KEY
    };

    const resp = await axios.get(url, { params });
    const articles = resp.data?.results || [];

    let positive = 0, neutral = 0, negative = 0;

    for (const art of articles) {
      const s = art.insights?.[0]?.sentiment;
      if (s === 'positive') positive++;
      else if (s === 'neutral') neutral++;
      else if (s === 'negative') negative++;
    }

    res.json({
      ticker,
      sentiment: { positive, neutral, negative },
      articles
    });

  } catch (err) {
    console.error("News fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch news" });
  }
};

// Helper for Watchlist Summary
exports.fetchTickerNewsSummary = async (ticker) => {
  if (!MASSIVE_API_KEY) throw new Error("Massive API Key missing.");

  const url = `${MASSIVE_BASE_URL}/reference/news`;

  const params = {
    ticker: ticker.toUpperCase(),
    limit: 20,
    order: "desc",
    sort: "published_utc",
    apiKey: MASSIVE_API_KEY
  };

  const resp = await axios.get(url, { params });
  const articles = resp.data?.results || [];

  let positive = 0, neutral = 0, negative = 0;

  for (const art of articles) {
    const s = art.insights?.[0]?.sentiment;
    if (s === 'positive') positive++;
    else if (s === 'neutral') neutral++;
    else if (s === 'negative') negative++;
  }

  let latest = null;
  if (articles[0]) {
    latest = {
      title: articles[0].title,
      url: articles[0].article_url,
      sentiment: articles[0]?.insights?.[0]?.sentiment || "neutral"
    };
  }

  return {
    ticker: ticker.toUpperCase(),
    sentiment: { positive, neutral, negative },
    latest
  };
};
