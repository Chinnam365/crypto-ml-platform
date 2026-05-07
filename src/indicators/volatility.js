function calculateVolatility(
  candles,
  period = 10
) {

  if (
    candles.length < period
  ) {
    return 0;
  }

  const recentCandles =
    candles.slice(-period);

  let totalRange = 0;

  for (const candle of recentCandles) {

    const range =
      candle.high -
      candle.low;

    totalRange += range;
  }

  return (
    totalRange / period
  );
}

module.exports = {
  calculateVolatility,
};
