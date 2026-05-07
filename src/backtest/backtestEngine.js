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
  evaluateDogeStrategy,
} = require("../strategies/dogeStrategy");

async function runBacktest() {
  console.log(
    "Starting backtest..."
  );

  // =========================
  // LOAD HISTORICAL DATA
  // =========================

  const rawCandles =
    await getCandles(
      "DOGEUSDT",
      "5m",
      500
    );

  const candles =
    formatCandles(rawCandles);

  let activeTrade = null;

  let wins = 0;

  let losses = 0;

  let totalPnl = 0;

  // =========================
  // REPLAY LOOP
  // =========================

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

    const strategy =
      evaluateDogeStrategy({
        ema20,
        ema50,
        rsi,
        latestPrice,
      });

    // =========================
    // OPEN TRADE
    // =========================

    if (
      !activeTrade &&
      strategy.decision ===
        "BUY"
    ) {
      activeTrade = {
        entryPrice:
          latestPrice,

        takeProfit:
          latestPrice * 1.01,

        stopLoss:
          latestPrice * 0.995,
      };
    }

    // =========================
    // MONITOR TRADE
    // =========================

    if (activeTrade) {
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

  // =========================
  // RESULTS
  // =========================

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

  console.log(
    "Backtest completed"
  );

  console.log({
    totalTrades,

    wins,

    losses,

    winRate,

    totalPnl:
      totalPnl.toFixed(2),
  });

  return {
    totalTrades,

    wins,

    losses,

    winRate,

    totalPnl:
      totalPnl.toFixed(2),
  };
}

module.exports = {
  runBacktest,
};
