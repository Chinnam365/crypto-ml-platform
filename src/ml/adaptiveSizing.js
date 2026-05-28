const {
  optimizeSystemBehavior,
} = require("./selfOptimizer");

const {
  getRegimeStrategy,
} = require("./regimeStrategy");

/*
==================================================
ADAPTIVE POSITION SIZING
==================================================
*/

async function calculateAdaptivePositionSize({

  basePositionSize,

  confidence,

  regime,

  volatilityRegime,

  trend,

  momentumState,

  explorationTrade = false,
}) {

  try {

    /*
    ==================================================
    SELF OPTIMIZER
    ==================================================
    */

    const optimizer =
      await optimizeSystemBehavior();

    /*
    ==================================================
    REGIME STRATEGY
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
    START SIZE
    ==================================================
    */

    let size =
      Number(basePositionSize);

    /*
    ==================================================
    CONFIDENCE SCALING
    ==================================================
    */

    const confidenceMultiplier =

      confidence / 50;

    size *= confidenceMultiplier;

    /*
    ==================================================
    STRATEGY MULTIPLIER
    ==================================================
    */

    size *=
      strategy.positionSizingMultiplier;

    /*
    ==================================================
    SYSTEM PERFORMANCE
    ==================================================
    */

    size *=
      optimizer.confidenceMultiplier;

    /*
    ==================================================
    EXPLORATION DEFENSE
    ==================================================
    */

    if (
      explorationTrade
    ) {

      size *= 0.5;
    }

    /*
    ==================================================
    HIGH VOLATILITY DEFENSE
    ==================================================
    */

    if (
      volatilityRegime === "HIGH"
    ) {

      size *= 0.7;
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

      size *= 1.15;
    }

    /*
    ==================================================
    TREND BONUS
    ==================================================
    */

    if (
      regime === "TRENDING"
    ) {

      size *= 1.1;
    }

    /*
    ==================================================
    SIDEWAYS DEFENSE
    ==================================================
    */

    if (
      regime === "SIDEWAYS"
    ) {

      size *= 0.8;
    }

    /*
    ==================================================
    CLAMPING
    ==================================================
    */

    const minSize =

      basePositionSize * 0.2;

    const maxSize =

      basePositionSize * 3;

    size =

      Math.max(
        minSize,
        Math.min(
          size,
          maxSize
        )
      );

    size =
      Number(
        size.toFixed(4)
      );

    /*
    ==================================================
    LOGGING
    ==================================================
    */

    console.log(`
==================================
ADAPTIVE POSITION SIZING
==================================

Base Size:
${basePositionSize}

Final Size:
${size}

Confidence:
${confidence}

Confidence Multiplier:
${confidenceMultiplier.toFixed(2)}

Regime:
${regime}

Volatility:
${volatilityRegime}

Strategy Mode:
${strategy.mode}

Exploration Trade:
${explorationTrade}

System Confidence:
${optimizer.confidenceMultiplier}

==================================
`);

    return {

      finalSize: size,

      confidenceMultiplier:
        Number(
          confidenceMultiplier.toFixed(2)
        ),

      strategyMode:
        strategy.mode,

      explorationTrade,
    };

  } catch (err) {

    console.log(`
==================================
ADAPTIVE SIZING ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

    return {

      finalSize:
        basePositionSize,

      confidenceMultiplier: 1,

      strategyMode:
        "BALANCED",

      explorationTrade: false,
    };
  }
}

module.exports = {
  calculateAdaptivePositionSize,
};
