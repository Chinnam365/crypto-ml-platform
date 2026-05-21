function calculateRSI(
  closes,
  period = 14
) {

  if (
    closes.length <
    period + 1
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
      closes[i] -
      closes[i - 1];

    if (
      difference >= 0
    ) {

      gains +=
        difference;

    } else {

      losses +=
        Math.abs(
          difference
        );
    }
  }

  const averageGain =
    gains / period;

  const averageLoss =
    losses / period;

  if (
    averageLoss === 0
  ) {
    return 100;
  }

  const rs =
    averageGain /
    averageLoss;

  const rsi =
    100 -
    (
      100 /
      (1 + rs)
    );

  return Number(
    rsi.toFixed(2)
  );
}

module.exports = {
  calculateRSI,
};
