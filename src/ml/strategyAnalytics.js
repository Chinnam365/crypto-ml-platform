const pool =
  require("../db/db");

async function generateStrategyAnalytics() {

  try {

    // =========================
    // LOAD CLOSED TRADES
    // =========================

    const result =
      await pool.query(

        `
        SELECT *
        FROM trade_history
        WHERE outcome != 'PENDING'
        `
      );

    const trades =
      result.rows;

    // =========================
    // EMPTY DATASET
    // =========================

    if (
      trades.length === 0
    ) {

      return {

        totalTrades: 0,

        wins: 0,

        losses: 0,

        winRate: 0,

        averagePnL: 0,
      };
    }

    // =========================
    // CALCULATIONS
    // =========================

    let wins = 0;

    let losses = 0;

    let totalPnL = 0;

    for (
      const trade of trades
    ) {

      totalPnL +=
        Number(
          trade.pnl
        );

      if (
        trade.outcome ===
        "WIN"
      ) {

        wins++;
      }

      if (
        trade.outcome ===
        "LOSS"
      ) {

        losses++;
      }
    }

    // =========================
    // METRICS
    // =========================

    const totalTrades =
      trades.length;

    const winRate =
      (
        wins /
        totalTrades
      ) * 100;

    const averagePnL =
      totalPnL /
      totalTrades;

    return {

      totalTrades,

      wins,

      losses,

      winRate:
        Number(
          winRate.toFixed(2)
        ),

      averagePnL:
        Number(
          averagePnL.toFixed(2)
        ),
    };

  } catch (err) {

    console.error(

      "Strategy Analytics Error:",

      err.message
    );

    return {

      totalTrades: 0,

      wins: 0,

      losses: 0,

      winRate: 0,

      averagePnL: 0,
    };
  }
}

module.exports = {
  generateStrategyAnalytics,
};
