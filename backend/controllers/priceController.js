// controllers/priceController.js
const axios = require("axios"); // HTTP client

const MASSIVE_BASE_URL = process.env.MASSIVE_BASE_URL || "https://api.massive.com/v2"; // base URL
const MASSIVE_API_KEY = process.env.MASSIVE_API_KEY; // API key

exports.fetchLastPrice = async (ticker) => {
  if (!MASSIVE_API_KEY) throw new Error("Missing Massive API key."); // ensure key exists

  const url = `${MASSIVE_BASE_URL}/aggs/ticker/${ticker.toUpperCase()}/prev`; // previous bar endpoint
  const params = { apiKey: MASSIVE_API_KEY }; // request params

  const resp = await axios.get(url, { params }); // fetch previous bar
  const results = resp.data?.results || []; // extract results

  if (!results.length) return null; // no data available

  const bar = results[0]; // get latest bar

  return {
    ticker: ticker.toUpperCase(), // normalized ticker
    close: bar.c, // close price
    timestamp: bar.t // bar timestamp
  };
};
