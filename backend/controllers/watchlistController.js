// controllers/watchlistController.js
const Watchlist = require('../models/Watchlist'); // watchlist model
const { fetchTickerNewsSummary } = require('./newsController'); // sentiment helper
const { fetchLastPrice } = require('./priceController'); // price helper

exports.getWatchlist = async (req, res) => {
  try {
    const list = await Watchlist.findOne({ user: req.user.id }); // find user's list

    if (!list) return res.json({ tickers: [] }); // return empty if none

    return res.json({ tickers: list.tickers }); // return stored tickers
  } catch (err) {
    console.error("Get watchlist error:", err.message); // log error
    res.status(500).json({ message: "Server error" }); // error response
  }
};

exports.addToWatchlist = async (req, res) => {
  try {
    const { ticker } = req.body; // get ticker from body
    if (!ticker) return res.status(400).json({ message: "Ticker required" });

    let list = await Watchlist.findOne({ user: req.user.id }); // get watchlist

    if (!list) list = new Watchlist({ user: req.user.id, tickers: [] }); // create if missing

    const symbol = ticker.toUpperCase(); // normalize symbol

    if (!list.tickers.includes(symbol)) {
      list.tickers.push(symbol); // add only if not already in list
      await list.save(); // save update
    }

    res.json({ message: "Added to watchlist" }); // success response
  } catch (err) {
    console.error("Add error:", err.message); // log error
    res.status(500).json({ message: "Server error" }); // error response
  }
};

exports.removeFromWatchlist = async (req, res) => {
  try {
    const symbol = req.params.ticker.toUpperCase(); // normalize symbol

    const list = await Watchlist.findOne({ user: req.user.id }); // get list
    if (!list) return res.json({ message: "Nothing to delete" });

    list.tickers = list.tickers.filter(t => t !== symbol); // remove symbol
    await list.save(); // save changes

    res.json({ message: "Removed from watchlist" }); // success response
  } catch (err) {
    console.error("Delete error:", err.message); // log error
    res.status(500).json({ message: "Server error" }); // error response
  }
};

exports.getFullWatchlist = async (req, res) => {
  try {
    const list = await Watchlist.findOne({ user: req.user.id }); // load list

    if (!list || list.tickers.length === 0) return res.json([]); // empty list case

    const tickers = list.tickers; // array of tickers

    const output = await Promise.all(
      tickers.map(async ticker => {
        try {
          const [summary, price] = await Promise.all([
            fetchTickerNewsSummary(ticker), // sentiment lookup
            fetchLastPrice(ticker) // pricing lookup
          ]);

          return {
            ticker,
            displayName: ticker, // placeholder name
            price: price?.close ?? null, // last price or null
            sentiment: summary.sentiment, // sentiment summary
            latest: summary.latest // latest article
          };
        } catch (err) {
          console.error(`Error fetching summary for ${ticker}:`, err.message); // log per-ticker error

          return {
            ticker,
            displayName: ticker,
            price: null, // fallback price
            sentiment: { positive: 0, neutral: 0, negative: 0 }, // fallback sentiment
            latest: null // no latest article
          };
        }
      })
    );

    res.json(output); // send full list data
  } catch (err) {
    console.error("Full watchlist error:", err.message); // log error
    res.status(500).json({ message: "Server error" }); // error response
  }
};
