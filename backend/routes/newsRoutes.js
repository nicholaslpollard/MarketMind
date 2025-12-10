const express = require('express');
const router = express.Router();

const {
  searchNews,
  getFullTickerNews
} = require('../controllers/newsController');

// Basic search (used by dashboard)
router.get('/:ticker', searchNews);

// NEW — Full news package
router.get('/:ticker/full', getFullTickerNews);

module.exports = router;
