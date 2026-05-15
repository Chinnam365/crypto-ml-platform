const {
  calculateEMA,
} = require("./ema");

function detectTrend(closes) {

  if (!closes || closes.length < 50) {
    return "SIDEWAYS";
  }

  const ema20 =
    calculateEMA(
      closes.slice(-20),
      20
    );

  const ema50 =
    calculateEMA(
      closes.slice(-50),
      50
    );

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
