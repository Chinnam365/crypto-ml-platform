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
// TRAIN MODEL
// =====================================

async function trainModel() {

  console.log(
    "Training ML model..."
  );

  // ===================================
  // LOAD DATASET
  // ===================================

  const raw =
    fs.readFileSync(
      "/tmp/training-data.json",
      "utf-8"
    );

  const dataset =
    JSON.parse(raw);

  // ===================================
  // FEATURE MATRIX
  // ===================================

  const X = [];

  const y = [];

  for (const row of dataset) {

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
  // INITIALIZE
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

      // Linear equation

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

      // Prediction

      const prediction =
        sigmoid(z);

      // Error

      const error =
        prediction -
        label;

      // Update weights

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

      // Update bias

      bias -=
        learningRate *
        error;

      totalLoss +=
        Math.abs(error);
    }

    // Logging

    if (
      epoch % 100 === 0
    ) {

      console.log(

        `Epoch ${epoch}`,

        `Loss ${(
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

    "/tmp/model.json",

    JSON.stringify(
      model,
      null,
      2
    )
  );

  console.log(
    "Model training completed"
  );

  return {

    samples:
      X.length,

    features:
      featureCount,

    epochs,

    model:
      "logistic-regression",

    savedTo:
      "/tmp/model.json",
  };
}

module.exports = {
  trainModel,
};
