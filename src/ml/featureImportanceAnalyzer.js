const pool =
  require("../db/db");

/*
==================================================
FEATURE IMPORTANCE ANALYZER
==================================================
*/

async function analyzeFeatureImportance() {

  try {

    /*
    ==================================================
    LOAD COMPLETED TRADES
    ==================================================
    */

    const result =
      await pool.query(

        `
        SELECT *

        FROM trade_history

        WHERE

          outcome IS NOT NULL

          AND

          outcome != 'PENDING'

        ORDER BY id DESC

        LIMIT 1000
        `
      );

    const trades =
      result.rows;

    /*
    ==================================================
    MINIMUM SAMPLE SIZE
    ==================================================
    */

    if (
      trades.length < 20
    ) {

      return {

        success: false,

        message:
          "Not enough completed trades",
      };
    }

    /*
    ==================================================
    FEATURE TRACKERS
    ==================================================
    */

    let bullishWins = 0;
    let bullishTotal = 0;

    let bearishWins = 0;
    let bearishTotal = 0;

    let highVolWins = 0;
    let highVolTotal = 0;

    let lowVolWins = 0;
    let lowVolTotal = 0;

    let alignedWins = 0;
    let alignedTotal = 0;

    let momentumWins = 0;
    let momentumTotal = 0;

    /*
    ==================================================
    PROCESS TRADES
    ==================================================
    */

    for (
      const trade of trades
    ) {

      const isWin =
        trade.outcome === "WIN";

      /*
      ================================================
      TREND
      ================================================
      */

      if (
        trade.trend === "BULLISH"
      ) {

        bullishTotal++;

        if (isWin) {
          bullishWins++;
        }
      }

      if (
        trade.trend === "BEARISH"
      ) {

        bearishTotal++;

        if (isWin) {
          bearishWins++;
        }
      }

      /*
      ================================================
      VOLATILITY
      ================================================
      */

      if (
        trade.volatility_regime ===
        "HIGH"
      ) {

        highVolTotal++;

        if (isWin) {
          highVolWins++;
        }
      }

      if (
        trade.volatility_regime ===
        "LOW"
      ) {

        lowVolTotal++;

        if (isWin) {
          lowVolWins++;
        }
      }

      /*
      ================================================
      ALIGNMENT
      ================================================
      */

      if (
        Number(
          trade.alignment_score
        ) >= 70
      ) {

        alignedTotal++;

        if (isWin) {
          alignedWins++;
        }
      }

      /*
      ================================================
      MOMENTUM
      ================================================
      */

      if (

        trade.momentum_state ===
        "BULLISH_ACCELERATION"

        ||

        trade.momentum_state ===
        "BEARISH_ACCELERATION"
      ) {

        momentumTotal++;

        if (isWin) {
          momentumWins++;
        }
      }
    }

    /*
    ==================================================
    SAFE WINRATE
    ==================================================
    */

    function safeRate(
      wins,
      total
    ) {

      if (
        total === 0
      ) {
        return 0;
      }

      return Number(

        (
          (wins / total) * 100
        ).toFixed(2)
      );
    }

    /*
    ==================================================
    FINAL REPORT
    ==================================================
    */

    const report = {

      sampleSize:
        trades.length,

      trend: {

        bullishTrendWinRate:
          safeRate(
            bullishWins,
            bullishTotal
          ),

        bearishTrendWinRate:
          safeRate(
            bearishWins,
            bearishTotal
          ),
      },

      volatility: {

        highVolatilityWinRate:
          safeRate(
            highVolWins,
            highVolTotal
          ),

        lowVolatilityWinRate:
          safeRate(
            lowVolWins,
            lowVolTotal
          ),
      },

      alignment: {

        alignedSetupWinRate:
          safeRate(
            alignedWins,
            alignedTotal
          ),
      },

      momentum: {

        accelerationWinRate:
          safeRate(
            momentumWins,
            momentumTotal
          ),
      },
    };

    console.log(`
==================================
FEATURE IMPORTANCE REPORT
==================================
`);

    console.log(report);

    console.log(`
==================================
`);

    return {

      success: true,

      report,
    };

  } catch (err) {

    console.log(`
==================================
FEATURE IMPORTANCE ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

    return {

      success: false,

      error: err.message,
    };
  }
}

module.exports = {
  analyzeFeatureImportance,
};
