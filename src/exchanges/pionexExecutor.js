async function placePionexOrder({

  symbol,

  side,

  quantity,

}) {

  return {

    exchange:
      "PIONEX",

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
  placePionexOrder,
};
