const {
  generateTrainingDataset,
} = require("./exportTrainingData");

const {
  predictTrade,
} = require("./predictTrade");

// =====================================
// OPTIMIZE THRESHOLD
// =====================================

async function optimizeThresholds() {

  console.log(
    "Optimizing ML thresholds..."
  );

  const dataset =
    await generateTrainingDataset();

  const thresholds = [

    0.50,
    0.55,
    0.60,
    0.65,
    0.70,
    0.75,
    0.80,
  ];

  const results = [];

  for (const threshold of thresholds) {

    let wins = 0;

    let losses = 0;

    let skipped = 0;

    let pnl = 0;

    for (const row of dataset) {

      if (
        row.result ===
        "TIMEOUT"
      ) {
        continue;
      }

      const prediction =
        predictTrade(row);

      if (
        prediction.probability <
        threshold
      ) {

        skipped++;

        continue;
      }

      if (
        row.result === "WIN"
      ) {

        wins++;

        pnl += 0.5;

      } else {

        losses++;

        pnl -= 0.7;
      }
    }

    const totalTrades =
      wins + losses;

    const winRate =
      totalTrades > 0
        ? (
            (wins /
              totalTrades) *
            100
          ).toFixed(2)
        : 0;

    results.push({

      threshold,

      totalTrades,

      wins,

      losses,

      skipped,

      winRate,

      totalPnL:
        pnl.toFixed(2),
    });
  }

  // ===================================
  // SORT BEST PNL
  // ===================================

  results.sort(

    (a, b) =>

      parseFloat(
        b.totalPnL
      ) -

      parseFloat(
        a.totalPnL
      )
  );

  return results;
}

module.exports = {
  optimizeThresholds,
};
