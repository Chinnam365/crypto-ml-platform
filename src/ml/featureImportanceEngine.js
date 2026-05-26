const pool =
  require("../db/db");

/*
==================================================
FEATURE IMPORTANCE ENGINE
==================================================
*/

async function calculateFeatureImportance() {

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

    function calculateWinRate(
      filteredTrades
    ) {

      if (
        filteredTrades.length === 0
      ) {
        return 0;
      }

      let wins = 0;

      for (
        const trade of filteredTrades
      ) {

        if (
          Number(trade.pnl) > 0
        ) {
          wins++;
        }
      }

      return Number(
        (
          (wins / filteredTrades.length)
          * 100
        ).toFixed(2)
      );
    }

    /*
    ==================================================
    ALIGNMENT
    ==================================================
    */

    const highAlignment =
      trades.filter(
        t =>
          Number(
            t.alignment_score
          ) >= 70
      );

    const lowAlignment =
      trades.filter(
        t =>
          Number(
            t.alignment_score
          ) < 70
      );

    /*
    ==================================================
    MOMENTUM
    ==================================================
    */

    const bullishMomentum =
      trades.filter(
        t =>
          t.momentum_state ===
          "BULLISH_ACCELERATION"
      );

    const bearishMomentum =
      trades.filter(
        t =>
          t.momentum_state ===
          "BEARISH_ACCELERATION"
      );

    /*
    ==================================================
    VOLATILITY
    ==================================================
    */

    const highVolatility =
      trades.filter(
        t =>
          t.volatility_regime ===
          "HIGH"
      );

    const normalVolatility =
      trades.filter(
        t =>
          t.volatility_regime ===
          "NORMAL"
      );

    /*
    ==================================================
    RESULTS
    ==================================================
    */

    const report = {

      sampleSize:
        trades.length,

      alignment: {

        highAlignmentWinRate:
          calculateWinRate(
            highAlignment
          ),

        lowAlignmentWinRate:
          calculateWinRate(
            lowAlignment
          ),
      },

      momentum: {

        bullishMomentumWinRate:
          calculateWinRate(
            bullishMomentum
          ),

        bearishMomentumWinRate:
          calculateWinRate(
            bearishMomentum
          ),
      },

      volatility: {

        highVolatilityWinRate:
          calculateWinRate(
            highVolatility
          ),

        normalVolatilityWinRate:
          calculateWinRate(
            normalVolatility
          ),
      },
    };

    return {

      success: true,

      report,
    };

  } catch (err) {

    console.log(

      "Feature importance error:",

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
  calculateFeatureImportance,
};
