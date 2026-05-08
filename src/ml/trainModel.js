const fs = require("fs");

const {
  generateTrainingDataset,
} = require("./exportTrainingData");

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
// TRAIN MODEL
// =====================================

async function trainModel() {

  console.log(
    "Training ML model..."
  );

  // ===================================
  // GENERATE DATASET IN MEMORY
  // ===================================

  const dataset =
    await generateTrainingDataset();

  // ===================================
  // FEATURE MATRIX
  // ===================================

  const X = [];

  const y = [];

  for (const row of dataset) {

    // Skip timeouts

    if (
      row.result ===
      "TIMEOUT"
    ) {
      continue;
    }

    X.push([

      row.rsi,

      row.volatility,

      row.score,

      row.bullish5m,

      row.bullish15m,

      row.bullish1h,

      row.btcBullish,

      row.ema5mSpread,

      row.ema15mSpread,

      row.ema1hSpread,
    ]);

    y.push(
      row.result === "WIN"
        ? 1
        : 0
    );
  }

  // ===================================
  // VALIDATION
  // ===================================

  if (X.length === 0) {

    throw new Error(
      "No training samples generated"
    );
  }

  // ===================================
  // INITIALIZE MODEL
  // ===================================

  const featureCount =
    X[0].length;

  let weights =
    new Array(
      featureCount
    ).fill(0);

  let bias = 0;

  const learningRate =
    0.0001;

  const epochs = 1000;

  // ===================================
  // TRAINING LOOP
  // ===================================

  for (
    let epoch = 0;
    epoch < epochs;
    epoch++
  ) {

    let totalLoss = 0;

    for (
      let i = 0;
      i < X.length;
      i++
    ) {

      const features =
        X[i];

      const label =
        y[i];

      // ================================
      // LINEAR COMBINATION
      // ================================

      let z = bias;

      for (
        let j = 0;
        j < featureCount;
        j++
      ) {

        z +=
          weights[j] *
          features[j];
      }

      // ================================
      // PREDICTION
      // ================================

      const prediction =
        sigmoid(z);

      // ================================
      // ERROR
      // ================================

      const error =
        prediction -
        label;

      // ================================
      // UPDATE WEIGHTS
      // ================================

      for (
        let j = 0;
        j < featureCount;
        j++
      ) {

        weights[j] -=
          learningRate *
          error *
          features[j];
      }

      // ================================
      // UPDATE BIAS
      // ================================

      bias -=
        learningRate *
        error;

      // ================================
      // LOSS TRACKING
      // ================================

      totalLoss +=
        Math.abs(error);
    }

    // ================================
    // PROGRESS LOGGING
    // ================================

    if (
      epoch % 100 === 0
    ) {

      console.log(

        `Epoch ${epoch}`,

        `Loss: ${(
          totalLoss /
          X.length
        ).toFixed(4)}`
      );
    }
  }

  // ===================================
  // SAVE MODEL
  // ===================================

  const model = {

    weights,

    bias,

    featureOrder: [

      "rsi",

      "volatility",

      "score",

      "bullish5m",

      "bullish15m",

      "bullish1h",

      "btcBullish",

      "ema5mSpread",

      "ema15mSpread",

      "ema1hSpread",
    ],
  };

  fs.writeFileSync(

    "./model.json",

    JSON.stringify(
      model,
      null,
      2
    )
  );

  console.log(
    "Model training completed"
  );

  console.log(
    "Model saved to model.json"
  );

  // ===================================
  // RETURN RESULTS
  // ===================================

  return {

    samples:
      X.length,

    features:
      featureCount,

    epochs,

    model:
      "logistic-regression",

    savedTo:
      "./model.json",
  };
}

module.exports = {
  trainModel,
};
