function calculateEMA(
  closes,
  period = 20
) {

  if (
    closes.length <
    period
  ) {
    return null;
  }

  const multiplier =
    2 / (period + 1);

  let ema =
    closes[0];

  for (
    let i = 1;
    i < closes.length;
    i++
  ) {

    ema =
      (
        closes[i] -
        ema
      ) *
      multiplier +
      ema;
  }

  return Number(
    ema.toFixed(2)
  );
}

module.exports = {
  calculateEMA,
};
