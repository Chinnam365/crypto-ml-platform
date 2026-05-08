const {
  getModel,
} = require("./modelStore");

const {
  normalizeFeatures,
} = require("./normalizeFeatures");

// =====================================
// PREDICT TRADE
// =====================================

function predictTrade(features) {

  const model =
    getModel();

  if (!model) {

    throw new Error(
      "Model not trained yet"
    );
  }

  const normalized =
    normalizeFeatures(features);

  const input = [[

    normalized.rsi,

    normalized.volatility,

    normalized.score,

    normalized.bullish5m,

    normalized.bullish15m,

    normalized.bullish1h,

    normalized.btcBullish,

    normalized.ema5mSpread,

    normalized.ema15mSpread,

    normalized.ema1hSpread,

    normalized.atr,

    normalized.candleBody,

    normalized.upperWick,

    normalized.lowerWick,

    normalized.emaSlope,

    normalized.rsiSlope,

    normalized.distanceFromEma,
  ]];

  // ===================================
  // RANDOM FOREST PREDICTION
  // ===================================

  const prediction =
    model.predict(input)[0];

  // ===================================
  // APPROX PROBABILITY
  // ===================================

  let probability = 0.35;

  if (prediction === 1) {

    probability = 0.75;
  }

  // ===================================
  // DECISION
  // ===================================

  let decision =
    "SKIP";

  if (
    probability >= 0.70
  ) {

    decision = "BUY";
  }

  return {

    probability:
      Number(
        probability.toFixed(4)
      ),

    decision,
  };
}

module.exports = {
  predictTrade,
};
