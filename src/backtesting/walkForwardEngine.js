const {
  runBacktest,
} = require("./backtestEngine");

async function runWalkForward({
  candles,
  windowSize = 500,
  stepSize = 100,
}) {

  const results = [];

  for (

    let start = 0;

    start + windowSize <
      candles.length;

    start += stepSize

  ) {

    const windowCandles =
      candles.slice(
        start,
        start +
          windowSize
      );

    const result =
      await runBacktest({

        strategy:
          "WALK_FORWARD",

        candles:
          windowCandles,
      });

    results.push(result);
  }

  const avgWinRate =

    results.reduce(
      (sum, r) =>
        sum + r.winRate,
      0
    )

    /

    Math.max(
      results.length,
      1
    );

  return {

    windows:
      results.length,

    averageWinRate:
      Number(
        avgWinRate.toFixed(
          2
        )
      ),

    results,

    status:
      "COMPLETE",
  };
}

module.exports = {
  runWalkForward,
};
