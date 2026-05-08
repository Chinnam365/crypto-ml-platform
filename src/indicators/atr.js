function calculateATR(
  candles,
  period = 14
) {

  if (
    candles.length <
    period + 1
  ) {
    return 0;
  }

  const trueRanges = [];

  for (
    let i = 1;
    i < candles.length;
    i++
  ) {

    const current =
      candles[i];

    const previous =
      candles[i - 1];

    const tr = Math.max(

      current.high -
        current.low,

      Math.abs(
        current.high -
        previous.close
      ),

      Math.abs(
        current.low -
        previous.close
      )
    );

    trueRanges.push(tr);
  }

  const recent =
    trueRanges.slice(
      -period
    );

  return (

    recent.reduce(
      (a, b) => a + b,
      0
    ) / period
  );
}

module.exports = {
  calculateATR,
};
