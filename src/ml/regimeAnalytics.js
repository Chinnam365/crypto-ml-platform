const pool =
  require("../db/db");

/*
==================================================
REGIME ANALYTICS ENGINE
==================================================
*/

async function calculateRegimeAnalytics() {

  try {

    const result =
      await pool.query(

        `
        SELECT *
        FROM trade_history
        WHERE pnl IS NOT NULL
        ORDER BY id DESC
        LIMIT 500
        `
      );

    const trades =
      result.rows;

    if (
      trades.length < 10
    ) {

      return {

        success: false,

        message:
          "Not enough completed trades",
      };
    }

    /*
    ==================================================
    HELPERS
    ==================================================
    */

    function calculateStats(
      filteredTrades
    ) {

      if (
        filteredTrades.length === 0
      ) {

        return {

          trades: 0,

          winRate: 0,

          avgPnL: 0,
        };
      }

      let wins = 0;

      let totalPnL = 0;

      for (
        const trade of filteredTrades
      ) {

        const pnl =
          Number(
            trade.pnl || 0
          );

        totalPnL += pnl;

        if (pnl > 0) {
          wins++;
        }
      }

      return {

        trades:
          filteredTrades.length,

        winRate:
          Number(
            (
              (
                wins /
                filteredTrades.length
              ) * 100
            ).toFixed(2)
          ),

        avgPnL:
          Number(
            (
              totalPnL /
              filteredTrades.length
            ).toFixed(2)
          ),
      };
    }

    /*
    ==================================================
    GROUP REGIMES
    ==================================================
    */

    const trendingTrades =
      trades.filter(
        t =>
          t.regime ===
          "TRENDING"
      );

    const rangingTrades =
      trades.filter(
        t =>
          t.regime ===
          "RANGING"
      );

    const chaoticTrades =
      trades.filter(
        t =>
          t.regime ===
          "CHAOTIC"
      );

    /*
    ==================================================
    RESULTS
    ==================================================
    */

    return {

      success: true,

      report: {

        sampleSize:
          trades.length,

        TRENDING:
          calculateStats(
            trendingTrades
          ),

        RANGING:
          calculateStats(
            rangingTrades
          ),

        CHAOTIC:
          calculateStats(
            chaoticTrades
          ),
      },
    };

  } catch (err) {

    console.log(

      "Regime analytics error:",

      err.message
    );

    return {

      success: false,

      error:
        err.message,
    };
  }
}

module.exports = {
  calculateRegimeAnalytics,
};
