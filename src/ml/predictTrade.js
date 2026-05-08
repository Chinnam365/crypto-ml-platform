const {
  getModel,
} = require("./modelStore");

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

  const input = [

    features.rsi,

    features.volatility,

    features.score,

    features.bullish5m,

    features.bullish15m,

    features.bullish1h,

    features.btcBullish,

    features.ema5mSpread,

    features.ema15mSpread,

    features.ema1hSpread,
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
