const axios = require("axios");

async function getMarketScanner() {

  try {

    const response =
  await axios.get(
    "https://api.binance.com/api/v3/ticker/24hr",
    {
      timeout: 15000,
      headers: {
        "User-Agent": "CryptoMLPlatform/1.0"
      }
    }
  );

    const pairs =
  response.data
    .filter(coin =>

      coin.symbol.endsWith("USDT") &&

      Number(coin.quoteVolume) >= 1000000 &&

      Number(coin.count) >= 5000 &&

      coin.symbol.indexOf("UP") === -1 &&

      coin.symbol.indexOf("DOWN") === -1 &&

      coin.symbol.indexOf("BULL") === -1 &&

      coin.symbol.indexOf("BEAR") === -1

    )
    .map(coin => ({

      symbol:
        coin.symbol,

      price:
        Number(coin.lastPrice),

      volume:
        Number(coin.volume),

      quoteVolume:
        Number(coin.quoteVolume),

      priceChange:
        Number(coin.priceChangePercent),

      trades:
        Number(coin.count),

      weightedPrice:
        Number(coin.weightedAvgPrice),

      highPrice:
        Number(coin.highPrice),

      lowPrice:
        Number(coin.lowPrice),

      openPrice:
        Number(coin.openPrice),

      lastPrice:
        Number(coin.lastPrice),

      bidPrice:
        Number(coin.bidPrice),

      askPrice:
        Number(coin.askPrice),

      spread:
        Number(coin.askPrice) -
        Number(coin.bidPrice)

    }));
    return pairs.sort((a, b) => {

  if (b.quoteVolume !== a.quoteVolume) {

    return b.quoteVolume - a.quoteVolume;

  }

  return b.trades - a.trades;

});

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
