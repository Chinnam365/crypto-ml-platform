const {
  calculateScore,
} = require("./scoreCalculator");

function evaluateDogeStrategy(data) {

  const {
    ema5m20,
    ema5m50,

    ema15m20,
    ema15m50,

    ema1h20,
    ema1h50,

    rsi5m,

    latestPrice,

    btcBullish,
  } = data;

  // =========================
  // CONDITIONS
  // =========================

  const bullish1h =
    ema1h20 > ema1h50;

  const bullish15m =
    ema15m20 > ema15m50;

  const bullish5m =
    ema5m20 > ema5m50;

  const idealRsi =
    rsi5m >= 50 &&
    rsi5m <= 65;

  // =========================
  // SCORE CALCULATION
  // =========================

  const {
    score,
    reasons,
  } = calculateScore({
    btcBullish,

    bullish1h,

    bullish15m,

    bullish5m,

    idealRsi,
  });

  // =========================
  // DECISION
  // =========================

  let decision = "SKIP";

  if (score >= 8) {
    decision = "BUY";
  }

  return {
    latestPrice,

    score,

    decision,

    reasons,
  };
}

module.exports = {
  evaluateDogeStrategy,
};
