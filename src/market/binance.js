const axios = require("axios");

async function getCandles(
  symbol,
  interval = "5m",
  limit = 500
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

async function getDoge5mCandles(
  limit = 500
) {
  return getCandles(
    "DOGEUSDT",
    "5m",
    limit
  );
}

async function getDoge15mCandles(
  limit = 500
) {
  return getCandles(
    "DOGEUSDT",
    "15m",
    limit
  );
}

async function getDoge1hCandles(
  limit = 500
) {
  return getCandles(
    "DOGEUSDT",
    "1h",
    limit
  );
}

// =========================
// BTC
// =========================

async function getBtc15mCandles(
  limit = 500
) {
  return getCandles(
    "BTCUSDT",
    "15m",
    limit
  );
}
// =========================
// LIVE PRICE
// =========================

async function getPrice(symbol) {

  try {

    const response =
      await axios.get(
        "https://api.binance.com/api/v3/ticker/price",
        {
          params: {
            symbol,
          },
        }
      );

    return Number(response.data.price);

  } catch (error) {

    console.error(
      `Price API Error (${symbol}):`,
      error.message
    );

    return null;
  }
}
module.exports = {
  getCandles,

  getDoge5mCandles,

  getDoge15mCandles,

  getDoge1hCandles,

  getBtc15mCandles,

  getPrice,
};
