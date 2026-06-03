const axios = require("axios");

async function getMarketScanner() {

  try {

    const response =
      await axios.get(
        "https://api.binance.com/api/v3/ticker/24hr"
      );

    const pairs =
      response.data
        .filter(
          coin =>
            coin.symbol.endsWith("USDT")
        )
        .map(coin => ({

          symbol:
            coin.symbol,

          price:
            Number(
              coin.lastPrice
            ),

          volume:
            Number(
              coin.volume
            ),

          quoteVolume:
            Number(
              coin.quoteVolume
            ),

          priceChange:
            Number(
              coin.priceChangePercent
            ),

          trades:
            Number(
              coin.count
            ),
        }));

    return pairs;

  } catch (err) {

    console.log(
      "Market Scanner Error:",
      err.message
    );

    return [];
  }
}

module.exports = {
  getMarketScanner,
};
