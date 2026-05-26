const pool =
  require("../db/db");

/*
==================================================
DATASET QUALITY ANALYTICS
==================================================
*/

async function analyzeDatasetQuality() {

  try {

    /*
    ==================================================
    LOAD SIGNAL DATA
    ==================================================
    */

    const result =
      await pool.query(

        `
        SELECT *

        FROM signal_memory

        WHERE
          signal_outcome IS NOT NULL

        ORDER BY id DESC

        LIMIT 5000
        `
      );

    const signals =
      result.rows;

    if (
      signals.length < 20
    ) {

      return {

        success: false,

        message:
          "Not enough labeled signals",
      };
    }

    /*
    ==================================================
    BASIC COUNTS
    ==================================================
    */

    let successCount = 0;

    let failureCount = 0;

    let holdCount = 0;

    let buyCount = 0;

    let sellCount = 0;

    let explorationCount = 0;

    let bullishCount = 0;

    let bearishCount = 0;

    let rangingCount = 0;

    let trendingCount = 0;

    let chaoticCount = 0;

    let totalConfidence = 0;

    /*
    ==================================================
    ITERATE SIGNALS
    ==================================================
    */

    for (
      const signal of signals
    ) {

      /*
      ================================================
      OUTCOMES
      ================================================
      */

      if (
        signal.signal_outcome ===
        "SUCCESS"
      ) {

        successCount++;
      }

      if (
        signal.signal_outcome ===
        "FAILURE"
      ) {

        failureCount++;
      }

      /*
      ================================================
      DECISIONS
      ================================================
      */

      if (
        signal.decision === "BUY"
      ) {

        buyCount++;
      }

      if (
        signal.decision === "SELL"
      ) {

        sellCount++;
      }

      if (
        signal.decision === "HOLD"
      ) {

        holdCount++;
      }

      /*
      ================================================
      EXPLORATION
      ================================================
      */

      if (
        signal.exploration_trade
      ) {

        explorationCount++;
      }

      /*
      ================================================
      REGIMES
      ================================================
      */

      if (
        signal.regime ===
        "TRENDING"
      ) {

        trendingCount++;
      }

      if (
        signal.regime ===
        "RANGING"
      ) {

        rangingCount++;
      }

      if (
        signal.regime ===
        "CHAOTIC"
      ) {

        chaoticCount++;
      }

      /*
      ================================================
      TRENDS
      ================================================
      */

      if (
        signal.trend ===
        "BULLISH"
      ) {

        bullishCount++;
      }

      if (
        signal.trend ===
        "BEARISH"
      ) {

        bearishCount++;
      }

      /*
      ================================================
      CONFIDENCE
      ================================================
      */

      totalConfidence +=
        Number(
          signal.confidence || 0
        );
    }

    /*
    ==================================================
    FINAL METRICS
    ==================================================
    */

    const totalSignals =
      signals.length;

    const avgConfidence =

      totalConfidence /
      totalSignals;

    return {

      success: true,

      report: {

        totalSignals,

        successRate:
          Number(
            (
              (
                successCount /
                totalSignals
              ) * 100
            ).toFixed(2)
          ),

        failureRate:
          Number(
            (
              (
                failureCount /
                totalSignals
              ) * 100
            ).toFixed(2)
          ),

        avgConfidence:
          Number(
            avgConfidence.toFixed(2)
          ),

        decisions: {

          BUY:
            buyCount,

          SELL:
            sellCount,

          HOLD:
            holdCount,
        },

        regimes: {

          TRENDING:
            trendingCount,

          RANGING:
            rangingCount,

          CHAOTIC:
            chaoticCount,
        },

        trends: {

          BULLISH:
            bullishCount,

          BEARISH:
            bearishCount,
        },

        explorationTrades:
          explorationCount,
      },
    };

  } catch (err) {

    console.log(

      "Dataset analytics error:",

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
  analyzeDatasetQuality,
};
