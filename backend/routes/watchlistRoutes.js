// routes/watchlistRoutes.js
const express = require('express');
const router = express.Router();

const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  getFullWatchlist
} = require('../controllers/watchlistController');

const { fetchLastPrice } = require('../controllers/priceController');

const auth = require('../middleware/authMiddleware');

// GET simple list of tickers
router.get('/', auth, getWatchlist);

// GET full enriched watchlist (sentiment, latest article, price)
router.get('/full', auth, getFullWatchlist);

// ADD ticker to watchlist
router.post('/add', auth, addToWatchlist);

// REMOVE ticker
router.delete('/:ticker', auth, removeFromWatchlist);

// GET price for a single ticker — NEW
router.get('/price/:ticker', auth, async (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase();
    const price = await fetchLastPrice(ticker);

    if (!price) {
      return res.status(404).json({ message: "Price not found" });
    }

    res.json({ ticker, price: price.close });
  } catch (err) {
    console.error("Price route error:", err.message);
    res.status(500).json({ message: "Failed to fetch price" });
  }
});

module.exports = router;
