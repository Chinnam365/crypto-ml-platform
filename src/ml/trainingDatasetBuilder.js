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
NORMALIZATION HELPERS
==================================================
*/

function normalizePercentage(
  value
) {

  return Number(
    (
      (value || 0) / 100
    ).toFixed(4)
  );
}

function normalizeHour(
  hour
) {

  return Number(
    (
      (hour || 0) / 23
    ).toFixed(4)
  );
}

function normalizeEmaDistance(
  value
) {

  /*
  Clamp between -10 and +10
  */

  const clamped =
    Math.max(
      -10,
      Math.min(
        10,
        value || 0
      )
    );

  return Number(
    (
      clamped / 10
    ).toFixed(4)
  );
}
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
  normalizePercentage(
    signal.confidence
  ),

          alignmentScore:
  normalizePercentage(
    signal.alignment_score
  ),
          momentumStrength:
  normalizePercentage(
    signal.momentum_strength
  ),

         rsi:
  normalizePercentage(
    signal.rsi
  ),

          emaDistance:
  normalizeEmaDistance(
    signal.ema_distance
  ),

          /*
          ==============================================
          TEMPORAL FEATURES
          ==============================================
          */

         marketHour:
  normalizeHour(
    signal.market_hour
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
