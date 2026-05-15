const {
  calculateEMA,
} = require("./ema");

function calculateMACD(closes) {

  const ema12 =
    calculateEMA(closes, 12);

  const ema26 =
    calculateEMA(closes, 26);

  if (!ema12 || !ema26) {
    return null;
  }

  const macd = ema12 - ema26;

  return macd;
}

module.exports = {
  calculateMACD,
};
