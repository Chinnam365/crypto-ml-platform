const axios = require("axios");

async function getDogeCandles() {
  try {
    const response = await axios.get(
      "https://api.binance.com/api/v3/klines",
      {
        params: {
          symbol: "DOGEUSDT",
          interval: "5m",
          limit: 50,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Binance API Error:", error.message);
    return [];
  }
}

module.exports = {
  getDogeCandles,
};
