const pool =
  require("../db");

async function generateAnalytics() {

  try {

    // =========================
    // TOTAL STATS
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

    const winResult =
      await pool.query(

        `
        SELECT
          COUNT(*) as wins
        FROM trades
        WHERE outcome = 'WIN'
        `
      );

    const totalTrades =
      Number(
        tradesResult.rows[0].total
      );

    const totalWins =
      Number(
        winResult.rows[0].wins
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
    // BEST SYMBOLS
    // =========================

    const symbolResult =
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
    // BEST REGIMES
    // =========================

    const regimeResult =
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

    const analytics = {

      totalTrades,

      totalWins,

      winRate:
        winRate.toFixed(2),

      avgPnL:
        avgPnL.toFixed(2),

      bestSymbols:
        symbolResult.rows,

      bestRegimes:
        regimeResult.rows,
    };

    console.log(
      "Analytics:",
      analytics
    );

    return analytics;

  } catch (error) {

    console.error(
      "Analytics failed:",
      error.message
    );

    return null;
  }
}

module.exports = {
  generateAnalytics,
};
