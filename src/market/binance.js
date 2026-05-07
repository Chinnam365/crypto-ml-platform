const axios = require("axios");

async function getCandles(
  symbol,
  interval = "5m",
  limit = 100
) {
  try {
    const response =
      await axios.get(
        "https://api.binance.com/api/v3/klines",
        {
          params: {
            symbol,
            interval,
            limit,
          },
        }
      );

    return response.data;
  } catch (error) {
    console.error(
      `Binance API Error (${symbol} ${interval}):`,
      error.message
    );

    return [];
  }
}

// =========================
// DOGE
// =========================

async function getDoge5mCandles() {
  return getCandles(
    "DOGEUSDT",
    "5m"
  );
}

async function getDoge15mCandles() {
  return getCandles(
    "DOGEUSDT",
    "15m"
  );
}

async function getDoge1hCandles() {
  return getCandles(
    "DOGEUSDT",
    "1h"
  );
}

// =========================
// BTC
// =========================

async function getBtc15mCandles() {
  return getCandles(
    "BTCUSDT",
    "15m"
  );
}

module.exports = {
  getCandles,

  getDoge5mCandles,

  getDoge15mCandles,

  getDoge1hCandles,

  getBtc15mCandles,
};
