const {
  getCandles,
} = require("../market/binance");

const {
  formatCandles,
} = require("../market/formatter");

const {
  calculateEMA,
} = require("../indicators/ema");

const {
  calculateRSI,
} = require("../indicators/rsi");

async function runOptimization() {
  console.log(
    "Starting optimization..."
  );

  const rawCandles =
    await getCandles(
      "DOGEUSDT",
      "5m",
      500
    );

  const candles =
    formatCandles(rawCandles);

  const results = [];

  // =========================
  // PARAMETER TESTS
  // =========================

  const rsiRanges = [
    { min: 45, max: 60 },

    { min: 50, max: 65 },

    { min: 55, max: 70 },
  ];

  for (const range of rsiRanges) {
    let wins = 0;

    let losses = 0;

    let totalPnl = 0;

    let activeTrade = null;

    for (
      let i = 50;
      i < candles.length;
      i++
    ) {
      const slice =
        candles.slice(0, i);

      const closes =
        slice.map(
          (c) => c.close
        );

      const latestPrice =
        closes[
          closes.length - 1
        ];

      const ema20 =
        calculateEMA(
          closes.slice(-20),
          20
        );

      const ema50 =
        calculateEMA(
          closes.slice(-50),
          50
        );

      const rsi =
        calculateRSI(
          closes.slice(-15)
        );

      // =====================
      // ENTRY CONDITIONS
      // =====================

      const bullish =
        ema20 > ema50;

      const validRsi =
        rsi >= range.min &&
        rsi <= range.max;

      // OPEN TRADE

      if (
        !activeTrade &&
        bullish &&
        validRsi
      ) {
        activeTrade = {
          entryPrice:
            latestPrice,

          takeProfit:
            latestPrice *
            1.01,

          stopLoss:
            latestPrice *
            0.995,
        };
      }

      // MONITOR TRADE

      if (activeTrade) {
        // TP

        if (
          latestPrice >=
          activeTrade.takeProfit
        ) {
          wins++;

          const pnl =
            ((latestPrice -
              activeTrade.entryPrice) /
              activeTrade.entryPrice) *
            100;

          totalPnl += pnl;

          activeTrade = null;
        }

        // SL

        else if (
          latestPrice <=
          activeTrade.stopLoss
        ) {
          losses++;

          const pnl =
            ((latestPrice -
              activeTrade.entryPrice) /
              activeTrade.entryPrice) *
            100;

          totalPnl += pnl;

          activeTrade = null;
        }
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
      rsiMin: range.min,

      rsiMax: range.max,

      totalTrades,

      wins,

      losses,

      winRate,

      totalPnl:
        totalPnl.toFixed(2),
    });
  }

  console.log(
    "Optimization completed"
  );

  console.log(results);

  return results;
}

module.exports = {
  runOptimization,
};
