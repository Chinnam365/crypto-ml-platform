const pool =
  require("../db/db");

/*
==================================================
BUILD TRAINING DATASET
==================================================
*/

async function buildTrainingDataset() {

  try {

    /*
    ==================================================
    LOAD SIGNAL MEMORY
    ==================================================
    */

    const result =
      await pool.query(

        `
        SELECT *

        FROM signal_memory

        WHERE

          signal_outcome IS NOT NULL

          AND

          outcome_checked = TRUE

        ORDER BY id DESC

        LIMIT 5000
        `
      );

    const signals =
      result.rows;

    /*
    ==================================================
    DATASET
    ==================================================
    */

    const dataset =
      signals.map(signal => {

        /*
        ================================================
        TARGET LABEL
        ================================================
        */

        let label = 0;

        if (
          signal.signal_outcome ===
          "SUCCESS"
        ) {

          label = 1;
        }

        /*
        ================================================
        NUMERIC FEATURES
        ================================================
        */

        return {

          /*
          ==============================================
          TARGET
          ==============================================
          */

          label,

          /*
          ==============================================
          CORE FEATURES
          ==============================================
          */

          confidence:
            Number(
              signal.confidence || 0
            ),

          alignmentScore:
            Number(
              signal.alignment_score || 0
            ),

          momentumStrength:
            Number(
              signal.momentum_strength || 0
            ),

          rsi:
            Number(
              signal.rsi || 0
            ),

          emaDistance:
            Number(
              signal.ema_distance || 0
            ),

          /*
          ==============================================
          TEMPORAL FEATURES
          ==============================================
          */

          marketHour:
            Number(
              signal.market_hour || 0
            ),

          isWeekend:
            signal.is_weekend
              ? 1
              : 0,

          /*
          ==============================================
          DECISION FEATURES
          ==============================================
          */

          isBuy:
            signal.decision === "BUY"
              ? 1
              : 0,

          isSell:
            signal.decision === "SELL"
              ? 1
              : 0,

          isHold:
            signal.decision === "HOLD"
              ? 1
              : 0,

          /*
          ==============================================
          TREND FEATURES
          ==============================================
          */

          bullishTrend:
            signal.trend === "BULLISH"
              ? 1
              : 0,

          bearishTrend:
            signal.trend === "BEARISH"
              ? 1
              : 0,

          /*
          ==============================================
          REGIME FEATURES
          ==============================================
          */

          trendingRegime:
            signal.regime === "TRENDING"
              ? 1
              : 0,

          rangingRegime:
            signal.regime === "RANGING"
              ? 1
              : 0,

          chaoticRegime:
            signal.regime === "CHAOTIC"
              ? 1
              : 0,

          /*
          ==============================================
          VOLATILITY FEATURES
          ==============================================
          */

          highVolatility:
            signal.volatility_regime === "HIGH"
              ? 1
              : 0,

          lowVolatility:
            signal.volatility_regime === "LOW"
              ? 1
              : 0,

          /*
          ==============================================
          MOMENTUM FEATURES
          ==============================================
          */

          bullishAcceleration:
            signal.momentum_state ===
            "BULLISH_ACCELERATION"
              ? 1
              : 0,

          bearishAcceleration:
            signal.momentum_state ===
            "BEARISH_ACCELERATION"
              ? 1
              : 0,

          /*
          ==============================================
          TRANSITION FEATURES
          ==============================================
          */

          trendTransition:
            signal.transition_type?.includes("_TO_")
              ? 1
              : 0,

          /*
          ==============================================
          EXPLORATION FEATURES
          ==============================================
          */

          explorationTrade:
            signal.exploration_trade
              ? 1
              : 0,
        };
      });

    return dataset;

  } catch (err) {

    console.log(

      "Dataset builder error:",

      err.message
    );

    return [];
  }
}

module.exports = {
  buildTrainingDataset,
};
