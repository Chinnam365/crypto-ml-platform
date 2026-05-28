const {
  getRegimeStrategy,
} = require("./regimeStrategy");

/*
==================================================
ADAPTIVE THRESHOLD ENGINE
==================================================
*/

async function calculateAdaptiveThreshold({

  baseThreshold = 57,

  regime,

  volatilityRegime,

  trend,

  momentumState,

  performanceScore = 0,
}) {

  try {

    /*
    ==================================================
    LOAD REGIME STRATEGY
    ==================================================
    */

    const strategy =
      await getRegimeStrategy({

        regime,

        volatilityRegime,

        trend,

        momentumState,
      });

    /*
    ==================================================
    INITIAL THRESHOLD
    ==================================================
    */

    let threshold =
      baseThreshold;

    /*
    ==================================================
    REGIME ADJUSTMENT
    ==================================================
    */

    threshold +=
      strategy.thresholdAdjustment;

    /*
    ==================================================
    PERFORMANCE ADJUSTMENT
    ==================================================
    */

    if (
      performanceScore > 0.5
    ) {

      threshold -= 5;
    }

    else if (
      performanceScore < -0.5
    ) {

      threshold += 5;
    }

    /*
    ==================================================
    HIGH VOLATILITY DEFENSE
    ==================================================
    */

    if (
      volatilityRegime === "HIGH"
    ) {

      threshold += 5;
    }

    /*
    ==================================================
    MOMENTUM BONUS
    ==================================================
    */

    if (

      momentumState ===
      "BULLISH_ACCELERATION"

      ||

      momentumState ===
      "BEARISH_ACCELERATION"
    ) {

      threshold -= 3;
    }

    /*
    ==================================================
    TREND BONUS
    ==================================================
    */

    if (
      regime === "TRENDING"
    ) {

      threshold -= 3;
    }

    /*
    ==================================================
    SIDEWAYS DEFENSE
    ==================================================
    */

    if (
      regime === "SIDEWAYS"
    ) {

      threshold += 4;
    }

    /*
    ==================================================
    CLAMPING
    ==================================================
    */

    threshold =

      Math.max(
        35,
        Math.min(
          threshold,
          85
        )
      );

    threshold =
      Number(
        threshold.toFixed(2)
      );

    /*
    ==================================================
    LOGGING
    ==================================================
    */

    console.log(`
==================================
ADAPTIVE THRESHOLD ENGINE
==================================

Base Threshold:
${baseThreshold}

Regime:
${regime}

Volatility:
${volatilityRegime}

Trend:
${trend}

Momentum:
${momentumState}

Performance Score:
${performanceScore}

Strategy Mode:
${strategy.mode}

Threshold Adjustment:
${strategy.thresholdAdjustment}

Final Threshold:
${threshold}

==================================
`);

    return {

      threshold,

      strategyMode:
        strategy.mode,

      strategy,
    };

  } catch (err) {

    console.log(`
==================================
ADAPTIVE THRESHOLD ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

    return {

      threshold:
        baseThreshold,

      strategyMode:
        "BALANCED",

      strategy: {},
    };
  }
}

/*
==================================================
BACKWARD COMPATIBILITY
==================================================
*/

async function getAdaptiveThreshold(
  options = {}
) {

  return await
    calculateAdaptiveThreshold(
      options
    );
}

module.exports = {

  calculateAdaptiveThreshold,

  getAdaptiveThreshold,
};
