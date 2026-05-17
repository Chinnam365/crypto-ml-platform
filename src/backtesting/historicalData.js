const axios = require("axios");

async function getHistoricalCandles({

  symbol,

  interval = "15m",

  limit = 500,
}) {

  try {

    const url =
      `https://api.binance.com/api/v3/klines` +
      `?symbol=${symbol}` +
      `&interval=${interval}` +
      `&limit=${limit}`;

    const response =
      await axios.get(url);

    return response.data.map(candle => ({

      openTime:
        candle[0],

      open:
        Number(candle[1]),

      high:
        Number(candle[2]),

      low:
        Number(candle[3]),

      close:
        Number(candle[4]),

      volume:
        Number(candle[5]),
    }));

  } catch (error) {

    console.error(
      "Historical data error:",
      error.message
    );

    return [];
  }
}

module.exports = {
  getHistoricalCandles,
};
