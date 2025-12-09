// controllers/watchlistController.js
const Watchlist = require('../models/Watchlist');
const { fetchTickerNewsSummary } = require('./newsController');
const { fetchLastPrice } = require('./priceController');

exports.getWatchlist = async (req, res) => {
  try {
    const list = await Watchlist.findOne({ user: req.user.id });

    if (!list) return res.json({ tickers: [] });

    return res.json({ tickers: list.tickers });
  } catch (err) {
    console.error("Get watchlist error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addToWatchlist = async (req, res) => {
  try {
    const { ticker } = req.body;
    if (!ticker) return res.status(400).json({ message: "Ticker required" });

    let list = await Watchlist.findOne({ user: req.user.id });

    if (!list) list = new Watchlist({ user: req.user.id, tickers: [] });

    const symbol = ticker.toUpperCase();

    if (!list.tickers.includes(symbol)) {
      list.tickers.push(symbol);
      await list.save();
    }

    res.json({ message: "Added to watchlist" });
  } catch (err) {
    console.error("Add error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeFromWatchlist = async (req, res) => {
  try {
    const symbol = req.params.ticker.toUpperCase();

    const list = await Watchlist.findOne({ user: req.user.id });
    if (!list) return res.json({ message: "Nothing to delete" });

    list.tickers = list.tickers.filter(t => t !== symbol);
    await list.save();

    res.json({ message: "Removed from watchlist" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFullWatchlist = async (req, res) => {
  try {
    const list = await Watchlist.findOne({ user: req.user.id });

    if (!list || list.tickers.length === 0) return res.json([]);

    const tickers = list.tickers;

    const output = await Promise.all(
      tickers.map(async ticker => {
        try {
          const [summary, price] = await Promise.all([
            fetchTickerNewsSummary(ticker),
            fetchLastPrice(ticker)
          ]);

          return {
            ticker,
            displayName: ticker, // TODO: upgrade to company-name lookup
            price: price?.close ?? null,
            sentiment: summary.sentiment,
            latest: summary.latest
          };
        } catch (err) {
          console.error(`Error fetching summary for ${ticker}:`, err.message);

          return {
            ticker,
            displayName: ticker,
            price: null,
            sentiment: { positive: 0, neutral: 0, negative: 0 },
            latest: null
          };
        }
      })
    );

    res.json(output);
  } catch (err) {
    console.error("Full watchlist error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
