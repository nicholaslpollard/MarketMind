// controllers/priceController.js
const axios = require("axios");

const MASSIVE_BASE_URL = process.env.MASSIVE_BASE_URL || "https://api.massive.com/v2";
const MASSIVE_API_KEY = process.env.MASSIVE_API_KEY;

exports.fetchLastPrice = async (ticker) => {
  if (!MASSIVE_API_KEY) throw new Error("Missing Massive API key.");

  const url = `${MASSIVE_BASE_URL}/aggs/ticker/${ticker.toUpperCase()}/prev`;
  const params = { apiKey: MASSIVE_API_KEY };

  const resp = await axios.get(url, { params });
  const results = resp.data?.results || [];

  if (!results.length) return null;

  const bar = results[0];

  return {
    ticker: ticker.toUpperCase(),
    close: bar.c,
    timestamp: bar.t
  };
};
