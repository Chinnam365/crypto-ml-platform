const {
  calculateEMA,
} = require("./ema");

function detectTrend(closes) {

  const ema20 =
    calculateEMA(closes, 20);

  const ema50 =
    calculateEMA(closes, 50);

  if (!ema20 || !ema50) {
    return "SIDEWAYS";
  }

  if (ema20 > ema50) {
    return "BULLISH";
  }

  if (ema20 < ema50) {
    return "BEARISH";
  }

  return "SIDEWAYS";
}

module.exports = {
  detectTrend,
};
