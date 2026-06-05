function calculatePnL({

  entryPrice,

  currentPrice,

  side,

}) {

  let pnl = 0;

  if (
    side === "BUY"
  ) {

    pnl =

      (
        (
          currentPrice -
          entryPrice
        ) /

        entryPrice
      ) * 100;
  }

  else {

    pnl =

      (
        (
          entryPrice -
          currentPrice
        ) /

        entryPrice
      ) * 100;
  }

  return Number(
    pnl.toFixed(2)
  );
}

module.exports = {
  calculatePnL,
};
