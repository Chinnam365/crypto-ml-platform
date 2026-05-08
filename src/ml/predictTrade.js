const {
  getModel,
} = require("./modelStore");

const {
  normalizeFeatures,
} = require("./normalizeFeatures");

// =====================================
// SIGMOID
// =====================================

function sigmoid(z) {

  return (
    1 /
    (1 + Math.exp(-z))
  );
}

// =====================================
// PREDICT
// =====================================

function predictTrade(features) {

  const model =
    getModel();

  if (!model) {

    throw new Error(
      "Model not trained yet"
    );
  }

  const {
    weights,
    bias,
  } = model;

  const normalized =
    normalizeFeatures(features);

  const input = [

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
  ];

  let z = bias;

  for (
    let i = 0;
    i < weights.length;
    i++
  ) {

    z +=
      weights[i] *
      input[i];
  }

  const probability =
    sigmoid(z);

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
