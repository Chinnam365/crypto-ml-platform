const {
  generateTrainingDataset,
} = require("./exportTrainingData");

const {
  setModel,
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
// TRAIN MODEL
// =====================================

async function trainModel() {

  console.log(
    "Training ML model..."
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

  if (X.length === 0) {

    throw new Error(
      "No training samples"
    );
  }

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
  // TRAIN LOOP
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

      let z = bias;

      for (
        let j = 0;
        j < featureCount;
        j++
      ) {

        z +=
          weights[j] *
          X[i][j];
      }

      const prediction =
        sigmoid(z);

      const error =
        prediction -
        y[i];

      for (
        let j = 0;
        j < featureCount;
        j++
      ) {

        weights[j] -=
          learningRate *
          error *
          X[i][j];
      }

      bias -=
        learningRate *
        error;

      totalLoss +=
        Math.abs(error);
    }

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
  // STORE MODEL IN MEMORY
  // ===================================

  const model = {

    weights,

    bias,
  };

  setModel(model);

  console.log(
    "ML model stored in memory"
  );

  return {

    samples:
      X.length,

    features:
      featureCount,

    epochs,

    model:
      "logistic-regression",

    status:
      "stored-in-memory",
  };
}

module.exports = {
  trainModel,
};
