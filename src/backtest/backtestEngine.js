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

const {
  calculateScore,
} = require("../strategies/scoreCalculator");

async function runBacktest() {

  console.log(
    "Starting production-grade backtest..."
  );

  // =========================
  // LOAD HISTORICAL DATA
  // =========================

  const rawCandles =
    await getCandles(
      "DOGEUSDT",
      "5m",
      2000
    );

  const candles =
    formatCandles(rawCandles);

  // =========================
  // THRESHOLDS
  // =========================

  const thresholds = [
    4, 5, 6, 7, 8,
  ];

  const results = [];

  // =========================
  // TEST THRESHOLDS
  // =========================

  for (const threshold of thresholds) {

    let wins = 0;

    let losses = 0;

    let timedOut = 0;

    let totalPnl = 0;

    let activeTrade = null;

    // =======================
    // REPLAY LOOP
    // =======================

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

      // =====================
      // INDICATORS
      // =====================

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
      // CONDITIONS
      // =====================

      const bullish5m =
        ema20 > ema50;

      // Simplified proxies
      // for replay version

      const bullish15m =
        bullish5m;

      const bullish1h =
        bullish5m;

      const btcBullish =
        bullish5m;

      const idealRsi =
        rsi >= 50 &&
        rsi <= 65;

      // =====================
      // SCORE
      // =====================

      const {
        score,
      } = calculateScore({
        btcBullish,

        bullish1h,

        bullish15m,

        bullish5m,

        idealRsi,
      });

      // =====================
      // OPEN TRADE
      // =====================

      if (
        !activeTrade &&
        score >= threshold
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

          openedAt: i,
        };
      }

      // =====================
      // MONITOR TRADE
      // =====================

      if (activeTrade) {

        const candlesOpen =
          i -
          activeTrade.openedAt;

        // TIMEOUT

        if (
          candlesOpen >= 24
        ) {

          const pnl =
            ((latestPrice -
              activeTrade.entryPrice) /
              activeTrade.entryPrice) *
            100;

          totalPnl += pnl;

          timedOut++;

          activeTrade = null;

          continue;
        }

        // TAKE PROFIT

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

        // STOP LOSS

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

    // =======================
    // RESULTS
    // =======================

    const totalTrades =
      wins +
      losses +
      timedOut;

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

      timedOut,

      winRate,

      totalPnl:
        totalPnl.toFixed(2),
    });
  }

  // =========================
  // SORT RESULTS
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
    "Backtest completed"
  );

  return results;
}

module.exports = {
  runBacktest,
};
