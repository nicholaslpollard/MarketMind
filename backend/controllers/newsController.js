// controllers/newsController.js
const axios = require('axios');

const MASSIVE_BASE_URL = process.env.MASSIVE_BASE_URL || 'https://api.massive.com/v2';
const MASSIVE_API_KEY = process.env.MASSIVE_API_KEY;

// ----------------------------------------------------------------------------
// Utility: Count sentiment fields from a Massive news article
// ----------------------------------------------------------------------------
function parseSentiment(article) {
  const s = article.insights?.[0]?.sentiment;
  return s === "positive" || s === "neutral" || s === "negative" ? s : "neutral";
}

// ----------------------------------------------------------------------------
// OLD ENDPOINT — still used by dashboard
// GET /api/news/:ticker
// ----------------------------------------------------------------------------
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
      const s = parseSentiment(art);
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

// ----------------------------------------------------------------------------
// Helper used by watchlistController
// ----------------------------------------------------------------------------
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
    const s = parseSentiment(art);
    if (s === 'positive') positive++;
    else if (s === 'neutral') neutral++;
    else if (s === 'negative') negative++;
  }

  let latest = null;
  if (articles[0]) {
    latest = {
      title: articles[0].title,
      url: articles[0].article_url,
      sentiment: parseSentiment(articles[0]),
      published_at: articles[0].published_utc
    };
  }

  return {
    ticker: ticker.toUpperCase(),
    sentiment: { positive, neutral, negative },
    latest
  };
};

// ----------------------------------------------------------------------------
// NEW ENDPOINT — full news + sentiment + price
// GET /api/news/:ticker/full
// ----------------------------------------------------------------------------
exports.getFullTickerNews = async (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase();

    const url = `${MASSIVE_BASE_URL}/reference/news`;

    const params = {
      ticker,
      limit: 25,
      order: "desc",
      sort: "published_utc",
      apiKey: MASSIVE_API_KEY
    };

    const resp = await axios.get(url, { params });

    const raw = resp.data?.results || [];

    // Count sentiment
    let sentiment = { positive: 0, neutral: 0, negative: 0 };

    // Transform articles cleanly:
    const articles = raw.map(a => {
      const s = parseSentiment(a);
      sentiment[s]++;

      return {
        title: a.title,
        url: a.article_url,
        sentiment: s,
        summary: a.description || "",
        published_at: a.published_utc
      };
    });

    return res.json({
      ticker,
      sentiment,
      latest: articles[0] || null,
      articles
    });

  } catch (err) {
    console.error("Full news error:", err.message);
    return res.status(500).json({ message: "Failed to fetch full ticker news" });
  }
};
