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
    LOAD LABELED SIGNALS
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
      signals.length < 50
    ) {

      return {

        success: false,

        message:
          "Not enough labeled signals",
      };
    }

    /*
    ==================================================
    FEATURE TRACKERS
    ==================================================
    */

    const featureScores = {

      highConfidence:
        { success: 0, total: 0 },

      bullishTrend:
        { success: 0, total: 0 },

      bearishTrend:
        { success: 0, total: 0 },

      highAlignment:
        { success: 0, total: 0 },

      bullishMomentum:
        { success: 0, total: 0 },

      lowVolatility:
        { success: 0, total: 0 },

      breakoutSetup:
        { success: 0, total: 0 },

      accumulation:
        { success: 0, total: 0 },

      explorationTrade:
        { success: 0, total: 0 },
    };

    /*
    ==================================================
    ITERATE SIGNALS
    ==================================================
    */

    for (
      const signal of signals
    ) {

      const isSuccess =

        signal.signal_outcome ===
        "SUCCESS";

      /*
      ================================================
      HIGH CONFIDENCE
      ================================================
      */

      if (
        signal.confidence >= 60
      ) {

        featureScores.highConfidence.total++;

        if (isSuccess) {

          featureScores.highConfidence.success++;
        }
      }

      /*
      ================================================
      BULLISH TREND
      ================================================
      */

      if (
        signal.trend ===
        "BULLISH"
      ) {

        featureScores.bullishTrend.total++;

        if (isSuccess) {

          featureScores.bullishTrend.success++;
        }
      }

      /*
      ================================================
      BEARISH TREND
      ================================================
      */

      if (
        signal.trend ===
        "BEARISH"
      ) {

        featureScores.bearishTrend.total++;

        if (isSuccess) {

          featureScores.bearishTrend.success++;
        }
      }

      /*
      ================================================
      HIGH ALIGNMENT
      ================================================
      */

      if (
        signal.alignment_score >= 70
      ) {

        featureScores.highAlignment.total++;

        if (isSuccess) {

          featureScores.highAlignment.success++;
        }
      }

      /*
      ================================================
      BULLISH MOMENTUM
      ================================================
      */

      if (

        signal.momentum_state ===
        "BULLISH_ACCELERATION"

      ) {

        featureScores.bullishMomentum.total++;

        if (isSuccess) {

          featureScores.bullishMomentum.success++;
        }
      }

      /*
      ================================================
      LOW VOLATILITY
      ================================================
      */

      if (
        signal.volatility_regime ===
        "LOW"
      ) {

        featureScores.lowVolatility.total++;

        if (isSuccess) {

          featureScores.lowVolatility.success++;
        }
      }

      /*
      ================================================
      BREAKOUT SETUP
      ================================================
      */

      if (
        signal.market_state ===
        "BREAKOUT_SETUP"
      ) {

        featureScores.breakoutSetup.total++;

        if (isSuccess) {

          featureScores.breakoutSetup.success++;
        }
      }

      /*
      ================================================
      ACCUMULATION
      ================================================
      */

      if (
        signal.market_state ===
        "ACCUMULATION"
      ) {

        featureScores.accumulation.total++;

        if (isSuccess) {

          featureScores.accumulation.success++;
        }
      }

      /*
      ================================================
      EXPLORATION TRADES
      ================================================
      */

      if (
        signal.exploration_trade
      ) {

        featureScores.explorationTrade.total++;

        if (isSuccess) {

          featureScores.explorationTrade.success++;
        }
      }
    }

    /*
    ==================================================
    CALCULATE SUCCESS RATES
    ==================================================
    */

    const report = {};

    for (
      const feature in featureScores
    ) {

      const data =
        featureScores[feature];

      const successRate =

        data.total > 0

          ?

          (
            data.success /
            data.total
          ) * 100

          :

          0;

      report[feature] = {

        totalSamples:
          data.total,

        successRate:
          Number(
            successRate.toFixed(2)
          ),
      };
    }

    return {

      success: true,

      totalSignals:
        signals.length,

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
  analyzeFeatureImportance,
};
