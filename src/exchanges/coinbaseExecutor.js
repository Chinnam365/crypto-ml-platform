async function placeCoinbaseOrder({

  symbol,

  side,

  quantity,

}) {

  return {

    exchange:
      "COINBASE",

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
  placeCoinbaseOrder,
};
