const fs = require("fs");

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
// LOAD MODEL
// =====================================

function loadModel() {

  const raw =
    fs.readFileSync(
      "./model.json",
      "utf-8"
    );

  return JSON.parse(raw);
}

// =====================================
// PREDICT
// =====================================

function predictTrade(features) {

  const model =
    loadModel();

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

  // ===================================
  // LINEAR COMBINATION
  // ===================================

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

  // ===================================
  // PROBABILITY
  // ===================================

  const probability =
    sigmoid(z);

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
