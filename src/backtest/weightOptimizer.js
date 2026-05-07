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

async function runWeightOptimization() {
  console.log(
    "Starting weight optimization..."
  );

  const rawCandles =
    await getCandles(
      "DOGEUSDT",
      "5m",
      20000
    );

  const candles =
    formatCandles(rawCandles);

  const results = [];

  // =========================
  // WEIGHT COMBINATIONS
  // =========================

  const btcWeights = [2, 3, 4];

  const trendWeights = [2, 3, 4];

  const rsiWeights = [1, 2, 3];

  for (const btcWeight of btcWeights) {
    for (const trendWeight of trendWeights) {
      for (const rsiWeight of rsiWeights) {

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
          // SCORE
          // =====================

          let score = 0;

          // BTC proxy
          if (ema20 > ema50) {
            score += btcWeight;
          }

          // Trend
          if (ema20 > ema50) {
            score += trendWeight;
          }

          // RSI
          if (
            rsi >= 50 &&
            rsi <= 65
          ) {
            score += rsiWeight;
          }

          // =====================
          // OPEN TRADE
          // =====================

          if (
            !activeTrade &&
            score >= 7
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

          // =====================
          // MONITOR TRADE
          // =====================

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
          btcWeight,

          trendWeight,

          rsiWeight,

          totalTrades,

          wins,

          losses,

          winRate,

          totalPnl:
            totalPnl.toFixed(2),
        });
      }
    }
  }

  // =========================
  // SORT BEST RESULTS
  // =========================

  results.sort(
    (a, b) =>
      parseFloat(
        b.totalPnl
      ) -
      parseFloat(
        a.totalPnl
      )
  );

  console.log(
    "Weight optimization completed"
  );

  return results.slice(0, 10);
}

module.exports = {
  runWeightOptimization,
};
