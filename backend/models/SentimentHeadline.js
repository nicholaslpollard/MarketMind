const mongoose = require('mongoose');

const sentimentHeadlineSchema = new mongoose.Schema(
  {
    cacheKey: {
      type: String,
      required: true,
      index: true
    },

    cachedAt: {
      type: Date,
      default: Date.now,
      index: true
    },

    ttl: {
      type: Number,
      default: 3600 // seconds (1 hour)
    },

    // Normalized payload (summary + articles)
    payload: {
      type: Object,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SentimentHeadline', sentimentHeadlineSchema);
