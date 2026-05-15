function calculateRSI(
  closes,
  period = 14
) {

  if (
    !closes ||
    closes.length < period + 1
  ) {
    return null;
  }

  let gains = 0;
  let losses = 0;

  for (
    let i = 1;
    i <= period;
    i++
  ) {

    const difference =
      closes[i] - closes[i - 1];

    if (difference >= 0) {
      gains += difference;
    } else {
      losses += Math.abs(
        difference
      );
    }
  }

  const avgGain =
    gains / period;

  const avgLoss =
    losses / period;

  if (avgLoss === 0) {
    return 100;
  }

  const rs =
    avgGain / avgLoss;

  const rsi =
    100 - (
      100 / (1 + rs)
    );

  return Number(
    rsi.toFixed(2)
  );
}

module.exports = {
  calculateRSI,
};
