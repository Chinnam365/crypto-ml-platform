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

    normalized.relativeVolume,

    normalized.bullishRatio,

    normalized.momentum,

    normalized.volatilityExpansion,
  ]];

  const estimators =
    model.estimators;

  if (
    !estimators ||
    estimators.length === 0
  ) {

    throw new Error(
      "Random Forest estimators missing"
    );
  }

  let buyVotes = 0;

  for (const tree of estimators) {

    const prediction =
      tree.predict(input)[0];

    if (prediction === 1) {

      buyVotes++;
    }
  }

  const probability =
    buyVotes /
    estimators.length;

  let decision =
    "SKIP";

  if (
    probability >= 0.65
  ) {

    decision = "BUY";
  }

  return {

    probability:
      Number(
        probability.toFixed(4)
      ),

    buyVotes,

    totalTrees:
      estimators.length,

    decision,
  };
}

module.exports = {
  predictTrade,
};
