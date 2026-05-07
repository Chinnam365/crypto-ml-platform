function calculateEMA(prices, period) {
  const multiplier = 2 / (period + 1);

  let ema = prices[0];

  for (let i = 1; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema;
  }

  return ema;
}

module.exports = {
  calculateEMA,
};
