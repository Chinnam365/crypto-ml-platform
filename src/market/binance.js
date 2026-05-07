const axios = require("axios");

async function getCandles(symbol, interval = "5m", limit = 50) {
  try {
    const response = await axios.get(
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
      `Binance API Error (${symbol}):`,
      error.message
    );

    return [];
  }
}

async function getDogeCandles() {
  return getCandles("DOGEUSDT");
}

async function getBtcCandles() {
  return getCandles("BTCUSDT", "15m");
}

module.exports = {
  getCandles,
  getDogeCandles,
  getBtcCandles,
};
