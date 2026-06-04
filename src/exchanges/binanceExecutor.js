async function placeBinanceOrder({

  symbol,

  side,

  quantity,

}) {

  return {

    exchange:
      "BINANCE",

    symbol,

    side,

    quantity,

    status:
      "PENDING",

    timestamp:
      new Date()
        .toISOString(),
  };
}

module.exports = {
  placeBinanceOrder,
};
