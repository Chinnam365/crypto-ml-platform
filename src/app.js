const express = require("express");

const app = express();

app.use(express.json());

// =====================================
// IMPORTS
// =====================================

const {
  getTrades,
} = require("./db/trades");

const {
  getDecisions,
} = require("./db/decisions");

const {
  runBacktest,
} = require("./backtest/backtestEngine");

const {
  runWeightOptimization,
} = require("./optimizer/weightOptimizer");

const {
  getDoge5mCandles,
} = require("./market/binance");

const {
  exportTrainingData,
} = require("./ml/exportTrainingData");

// =====================================
// ROOT
// =====================================

app.get("/", (req, res) => {

  res.json({
    status:
      "Crypto ML Platform Running",
  });
});

// =====================================
// TRADES
// =====================================

app.get(
  "/api/trades",

  async (req, res) => {

    try {

      const trades =
        await getTrades();

      res.json(trades);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error:
          error.message,
      });
    }
  }
);

// =====================================
// DECISIONS
// =====================================

app.get(
  "/api/decisions",

  async (req, res) => {

    try {

      const decisions =
        await getDecisions();

      res.json(decisions);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error:
          error.message,
      });
    }
  }
);

// =====================================
// BACKTEST
// =====================================

app.get(
  "/api/backtest",

  async (req, res) => {

    try {

      const result =
        await runBacktest();

      res.json(result);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error:
          error.message,
      });
    }
  }
);

// =====================================
// WEIGHT OPTIMIZER
// =====================================

app.get(
  "/api/weights",

  async (req, res) => {

    try {

      const result =
        await runWeightOptimization();

      res.json(result);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error:
          error.message,
      });
    }
  }
);

// =====================================
// DOGE MARKET DATA
// =====================================

app.get(
  "/api/doge",

  async (req, res) => {

    try {

      const candles =
        await getDoge5mCandles(50);

      res.json(candles);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error:
          error.message,
      });
    }
  }
);

// =====================================
// EXPORT TRAINING DATA
// =====================================

app.get(
  "/api/export-training-data",

  async (req, res) => {

    try {

      const result =
        await exportTrainingData();

      res.json(result);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error:
          error.message,
      });
    }
  }
);

// =====================================
// ANALYTICS
// =====================================

app.get(
  "/api/analytics",

  async (req, res) => {

    try {

      const trades =
        await getTrades();

      const decisions =
        await getDecisions();

      const totalTrades =
        trades.length;

      const wins =
        trades.filter(
          (t) =>
            t.result ===
            "TP_HIT"
        ).length;

      const losses =
        trades.filter(
          (t) =>
            t.result ===
            "SL_HIT"
        ).length;

      const totalPnl =
        trades.reduce(
          (sum, t) =>
            sum +
            parseFloat(
              t.pnl || 0
            ),
          0
        );

      const averagePnl =
        totalTrades > 0
          ? totalPnl /
            totalTrades
          : 0;

      const totalDecisions =
        decisions.length;

      const buySignals =
        decisions.filter(
          (d) =>
            d.decision ===
            "BUY"
        ).length;

      const skipSignals =
        decisions.filter(
          (d) =>
            d.decision ===
            "SKIP"
        ).length;

      const winRate =
        totalTrades > 0
          ? (
              (wins /
                totalTrades) *
              100
            ).toFixed(2)
          : 0;

      res.json({

        tradeAnalytics: {

          totalTrades,

          wins,

          losses,

          winRate:
            parseFloat(
              winRate
            ),

          totalPnl:
            parseFloat(
              totalPnl.toFixed(
                2
              )
            ),

          averagePnl:
            parseFloat(
              averagePnl.toFixed(
                4
              )
            ),
        },

        decisionAnalytics: {

          totalDecisions,

          buySignals,

          skipSignals,
        },
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        error:
          error.message,
      });
    }
  }
);

// =====================================
// EXPORT
// =====================================

module.exports = app;
