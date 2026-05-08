const {
  generateTrainingDataset,
} = require("./exportTrainingData");

const {
  predictTrade,
} = require("./predictTrade");

// =====================================
// FEATURE NAMES
// =====================================

const featureNames = [

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

  "atr",

  "candleBody",

  "upperWick",

  "lowerWick",

  "emaSlope",

  "rsiSlope",

  "distanceFromEma",

  "relativeVolume",

  "bullishRatio",

  "momentum",

  "volatilityExpansion",
];

// =====================================
// SCORE MODEL
// =====================================

function scoreModel(
  dataset
) {

  let correct = 0;

  let total = 0;

  for (const row of dataset) {

    if (
      row.result ===
      "TIMEOUT"
    ) {
      continue;
    }

    const prediction =
      predictTrade(row);

    const predictedWin =
      prediction.probability >=
      0.65;

    const actualWin =
      row.result === "WIN";

    if (
      predictedWin ===
      actualWin
    ) {

      correct++;
    }

    total++;
  }

  return (
    correct / total
  );
}

// =====================================
// SHUFFLE FEATURE
// =====================================

function shuffleFeature(
  dataset,
  feature
) {

  const values =
    dataset.map(
      (d) => d[feature]
    );

  for (
    let i =
      values.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() *
          (i + 1)
      );

    [
      values[i],
      values[j],
    ] = [
      values[j],
      values[i],
    ];
  }

  return dataset.map(
    (row, index) => ({

      ...row,

      [feature]:
        values[index],
    })
  );
}

// =====================================
// CALCULATE IMPORTANCE
// =====================================

async function calculateFeatureImportance() {

  console.log(
    "Calculating feature importance..."
  );

  const dataset =
    await generateTrainingDataset();

  const baselineScore =
    scoreModel(dataset);

  const results = [];

  for (const feature of featureNames) {

    const shuffled =
      shuffleFeature(
        dataset,
        feature
      );

    const shuffledScore =
      scoreModel(shuffled);

    const importance =
      baselineScore -
      shuffledScore;

    results.push({

      feature,

      importance:
        Number(
          importance.toFixed(4)
        ),
    });
  }

  results.sort(

    (a, b) =>

      b.importance -
      a.importance
  );

  return {

    baselineAccuracy:
      Number(
        baselineScore.toFixed(4)
      ),

    features:
      results,
  };
}

module.exports = {
  calculateFeatureImportance,
};
