// models/Watchlist.js
const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tickers: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model('Watchlist', WatchlistSchema);
