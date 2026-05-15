const pool =
  require("../db/db");

// =====================================
// ANALYTICS ENGINE
// =====================================

async function generateAnalytics() {

  try {

    // =========================
    // TOTAL TRADES
    // =========================

    const tradesResult =
      await pool.query(

        `
        SELECT

          COUNT(*) as total,

          AVG(pnl) as avg_pnl

        FROM trades
        `
      );

    // =========================
    // TOTAL WINS
    // =========================

    const winsResult =
      await pool.query(

        `
        SELECT

          COUNT(*) as wins

        FROM trades

        WHERE outcome = 'WIN'
        `
      );

    // =========================
    // BEST SYMBOLS
    // =========================

    const symbolsResult =
      await pool.query(

        `
        SELECT

          symbol,

          AVG(pnl) as avg_pnl,

          COUNT(*) as trades

        FROM trades

        GROUP BY symbol

        ORDER BY avg_pnl DESC
        `
      );

    // =========================
    // BEST TRENDS
    // =========================

    const trendsResult =
      await pool.query(

        `
        SELECT

          trend,

          AVG(pnl) as avg_pnl,

          COUNT(*) as trades

        FROM features

        WHERE outcome != 'OPEN'

        GROUP BY trend

        ORDER BY avg_pnl DESC
        `
      );

    // =========================
    // CALCULATIONS
    // =========================

    const totalTrades =
      Number(
        tradesResult.rows[0].total
      );

    const totalWins =
      Number(
        winsResult.rows[0].wins
      );

    const avgPnL =
      Number(
        tradesResult.rows[0].avg_pnl || 0
      );

    const winRate =

      totalTrades > 0

        ? (
            totalWins /
            totalTrades
          ) * 100

        : 0;

    // =========================
    // RETURN ANALYTICS
    // =========================

    return {

      totalTrades,

      totalWins,

      winRate:
        winRate.toFixed(2),

      avgPnL:
        avgPnL.toFixed(2),

      bestSymbols:
        symbolsResult.rows,

      bestTrends:
        trendsResult.rows,
    };

  } catch (error) {

    console.error(
      "Analytics failed:",
      error.message
    );

    return {

      error:
        error.message,
    };
  }
}

module.exports = {
  generateAnalytics,
};
