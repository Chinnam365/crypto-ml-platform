const pool =
  require("../db/db");

// =====================================
// GET BEST SYMBOLS
// =====================================

async function getBestSymbols() {

  try {

    const result =
      await pool.query(

        `
        SELECT

          symbol,

          AVG(pnl) as avg_pnl,

          COUNT(*) as trades

        FROM trades

        GROUP BY symbol

        HAVING COUNT(*) > 5

        ORDER BY avg_pnl DESC
        `
      );

    const ranked =
      result.rows.map(row => ({

        symbol:
          row.symbol,

        avgPnL:
          Number(row.avg_pnl),

        trades:
          Number(row.trades),
      }));

    console.log(
      "Symbol rankings:",
      ranked
    );

    return ranked;

  } catch (error) {

    console.error(

      "Symbol selector failed:",

      error.message
    );

    return [];
  }
}

module.exports = {
  getBestSymbols,
};
