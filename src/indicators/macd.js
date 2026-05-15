const {
  calculateEMA,
} = require("./ema");

function calculateMACD(closes) {

  if (!closes || closes.length < 26) {
    return null;
  }

  const ema12 =
    calculateEMA(
      closes.slice(-12),
      12
    );

  const ema26 =
    calculateEMA(
      closes.slice(-26),
      26
    );

  return ema12 - ema26;
}

module.exports = {
  calculateMACD,
};
