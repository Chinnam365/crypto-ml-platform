const express = require("express");

const router = express.Router();

const pool = require("../db/db");

router.get("/", async (req, res) => {
  try {
    // =========================
    // TRADE ANALYTICS
    // =========================

    const tradesResult =
      await pool.query(`
        SELECT *
        FROM trades
      `);

    const trades =
      tradesResult.rows;

    const totalTrades =
      trades.length;

    const wins =
      trades.filter(
        (t) =>
          t.result === "TP_HIT"
      ).length;

    const losses =
      trades.filter(
        (t) =>
          t.result === "SL_HIT"
      ).length;

    const winRate =
      totalTrades > 0
        ? (
            (wins /
              totalTrades) *
            100
          ).toFixed(2)
        : 0;

    const totalPnl =
      trades.reduce(
        (sum, trade) =>
          sum +
          Number(trade.pnl || 0),
        0
      );

    const averagePnl =
      totalTrades > 0
        ? (
            totalPnl /
            totalTrades
          ).toFixed(4)
        : 0;

    // =========================
    // DECISION ANALYTICS
    // =========================

    const decisionsResult =
      await pool.query(`
        SELECT *
        FROM decision_logs
      `);

    const decisions =
      decisionsResult.rows;

    const totalDecisions =
      decisions.length;

    const buySignals =
      decisions.filter(
        (d) =>
          d.decision === "BUY"
      ).length;

    const skipSignals =
      decisions.filter(
        (d) =>
          d.decision === "SKIP"
      ).length;

    // =========================
    // RESPONSE
    // =========================

    res.json({
      tradeAnalytics: {
        totalTrades,

        wins,

        losses,

        winRate:
          Number(winRate),

        totalPnl:
          Number(
            totalPnl.toFixed(4)
          ),

        averagePnl:
          Number(
            averagePnl
          ),
      },

      decisionAnalytics: {
        totalDecisions,

        buySignals,

        skipSignals,
      },
    });
  } catch (error) {
    res.status(500).json({
      error:
        error.message,
    });
  }
});

module.exports = router;
