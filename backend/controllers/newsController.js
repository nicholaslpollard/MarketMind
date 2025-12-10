// controllers/newsController.js
const axios = require('axios'); // HTTP client

const MASSIVE_BASE_URL = process.env.MASSIVE_BASE_URL || 'https://api.massive.com/v2'; // base URL
const MASSIVE_API_KEY = process.env.MASSIVE_API_KEY; // API key

// Utility: extract sentiment from article
function parseSentiment(article) {
  const s = article.insights?.[0]?.sentiment; // read sentiment field
  return s === "positive" || s === "neutral" || s === "negative" ? s : "neutral"; // default neutral
}

// endpoint for dashboard news lookup
exports.searchNews = async (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase(); // normalize ticker

    if (!MASSIVE_API_KEY) {
      return res.status(500).json({ message: "Missing Massive API Key" }); // key missing
    }

    const url = `${MASSIVE_BASE_URL}/reference/news`; // endpoint URL

    const params = {
      ticker,
      limit: 20,
      order: "desc",
      sort: "published_utc",
      apiKey: MASSIVE_API_KEY
    };

    const resp = await axios.get(url, { params }); // fetch articles
    const articles = resp.data?.results || []; // extract results

    let positive = 0, neutral = 0, negative = 0; // sentiment counters

    for (const art of articles) {
      const s = parseSentiment(art); // detect sentiment
      if (s === 'positive') positive++;
      else if (s === 'neutral') neutral++;
      else if (s === 'negative') negative++;
    }

    res.json({
      ticker,
      sentiment: { positive, neutral, negative }, // aggregated sentiment
      articles
    });

  } catch (err) {
    console.error("News fetch error:", err.message); // log error
    res.status(500).json({ message: "Failed to fetch news" }); // failure response
  }
};

// Helper for watchlist summary
exports.fetchTickerNewsSummary = async (ticker) => {
  if (!MASSIVE_API_KEY) throw new Error("Massive API Key missing."); // require key

  const url = `${MASSIVE_BASE_URL}/reference/news`; // endpoint URL

  const params = {
    ticker: ticker.toUpperCase(),
    limit: 20,
    order: "desc",
    sort: "published_utc",
    apiKey: MASSIVE_API_KEY
  };

  const resp = await axios.get(url, { params }); // fetch news
  const articles = resp.data?.results || []; // extract list

  let positive = 0, neutral = 0, negative = 0; // sentiment counters

  for (const art of articles) {
    const s = parseSentiment(art); // sentiment detection
    if (s === 'positive') positive++;
    else if (s === 'neutral') neutral++;
    else if (s === 'negative') negative++;
  }

  let latest = null; // placeholder for newest article
  if (articles[0]) {
    latest = {
      title: articles[0].title, // headline
      url: articles[0].article_url, // link
      sentiment: parseSentiment(articles[0]), // sentiment of newest
      published_at: articles[0].published_utc // timestamp
    };
  }

  return {
    ticker: ticker.toUpperCase(), // normalized ticker
    sentiment: { positive, neutral, negative }, // totals
    latest
  };
};

// endpoint for full news output
exports.getFullTickerNews = async (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase(); // normalize ticker

    const url = `${MASSIVE_BASE_URL}/reference/news`; // endpoint URL

    const params = {
      ticker,
      limit: 25,
      order: "desc",
      sort: "published_utc",
      apiKey: MASSIVE_API_KEY
    };

    const resp = await axios.get(url, { params }); // fetch articles

    const raw = resp.data?.results || []; // extract results

    let sentiment = { positive: 0, neutral: 0, negative: 0 }; // sentiment counter

    const articles = raw.map(a => {
      const s = parseSentiment(a); // compute article sentiment
      sentiment[s]++; // increment sentiment bucket

      return {
        title: a.title, // title field
        url: a.article_url, // article link
        sentiment: s, // sentiment label
        summary: a.description || "", // text summary
        published_at: a.published_utc // timestamp
      };
    });

    return res.json({
      ticker,
      sentiment, // aggregated totals
      latest: articles[0] || null, // most recent article
      articles // full transformed list
    });

  } catch (err) {
    console.error("Full news error:", err.message); // log error
    return res.status(500).json({ message: "Failed to fetch full ticker news" }); // failure response
  }
};
