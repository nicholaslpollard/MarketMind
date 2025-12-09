// routes/watchlistRoutes.js
const express = require('express');
const router = express.Router();

const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  getFullWatchlist
} = require('../controllers/watchlistController');

const auth = require('../middleware/authMiddleware');

// GET simple list of tickers
router.get('/', auth, getWatchlist);

// GET full enriched watchlist (sentiment, latest article, price)
router.get('/full', auth, getFullWatchlist);

// ADD ticker to watchlist
router.post('/add', auth, addToWatchlist);

// REMOVE ticker
router.delete('/:ticker', auth, removeFromWatchlist);

module.exports = router;
