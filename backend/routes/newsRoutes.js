const express = require('express');
const router = express.Router();
const { searchNews } = require('../controllers/newsController');

router.get('/:ticker', searchNews);

module.exports = router;
