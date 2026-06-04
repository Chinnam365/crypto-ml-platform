async function placePaperOrder({

  symbol,

  side,

  quantity,

}) {

  return {

    exchange:
      "PAPER",

    symbol,

    side,

    quantity,

    status:
      "FILLED",

    timestamp:
      new Date()
        .toISOString(),
  };
}

module.exports = {
  placePaperOrder,
};
