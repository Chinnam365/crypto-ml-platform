const {
  RandomForestClassifier,
} = require(
  "ml-random-forest"
);

const {
  generateTrainingDataset,
} = require("./exportTrainingData");

const {
  setModel,
} = require("./modelStore");

const {
  normalizeFeatures,
} = require("./normalizeFeatures");

// =====================================
// TRAIN RANDOM FOREST
// =====================================

async function trainModel() {

  console.log(
    "Training Random Forest model..."
  );

  const dataset =
    await generateTrainingDataset();

  const X = [];

  const y = [];

  for (const row of dataset) {

    if (
      row.result ===
      "TIMEOUT"
    ) {
      continue;
    }

    const normalized =
      normalizeFeatures(row);

    X.push([

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
    ]);

    y.push(
      row.result === "WIN"
        ? 1
        : 0
    );
  }

  if (X.length === 0) {

    throw new Error(
      "No training samples"
    );
  }

  // ===================================
  // RANDOM FOREST OPTIONS
  // ===================================

  const options = {

    seed: 42,

    maxFeatures: 0.8,

    replacement: true,

    nEstimators: 100,
  };

  // ===================================
  // TRAIN MODEL
  // ===================================

  const classifier =
    new RandomForestClassifier(
      options
    );

  classifier.train(X, y);

  // ===================================
  // STORE MODEL
  // ===================================

  setModel(classifier);

  console.log(
    "Random Forest model stored in memory"
  );

  return {

    samples:
      X.length,

    features:
      X[0].length,

    model:
      "random-forest",

    trees:
      options.nEstimators,

    status:
      "stored-in-memory",
  };
}

module.exports = {
  trainModel,
};
