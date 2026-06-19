const {
  getAdaptiveWeights,
} = require("./adaptiveWeights");

/*
==================================================
REGIME SPECIALIZATION ENGINE
==================================================
*/

async function getRegimeStrategy({

  regime,

  volatilityRegime,

  trend,

  momentumState,
}) {

  try {

    /*
    ==================================================
    ADAPTIVE WEIGHTS
    ==================================================
    */

    const adaptiveWeightResult =
  await getAdaptiveWeights({

    regime,

    trend,

    volatilityRegime,

    momentumState,

    decision: "HOLD"
  });

const weights =
  adaptiveWeightResult.weights ||
  adaptiveWeightResult;

    /*
    ==================================================
    DEFAULT STRATEGY
    ==================================================
    */

    let strategy = {

      mode: "BALANCED",

      confidenceMultiplier: 1,

      thresholdAdjustment: 0,

      explorationBias: 0.3,

      positionSizingMultiplier: 1,

      featureBias: {

        rsi: weights.rsi,

        macd: weights.macd,

        trend: weights.trend,

        volatility: weights.volatility,

        alignment: weights.alignment,

        momentum: weights.momentum,
      },
    };

    /*
    ==================================================
    TRENDING MARKET
    ==================================================
    */

    if (
      regime === "TRENDING"
    ) {

      strategy = {

        mode: "TREND_FOLLOWING",

        confidenceMultiplier: 1.15,

        thresholdAdjustment: -5,

        explorationBias: 0.2,

        positionSizingMultiplier: 1.2,

        featureBias: {

          rsi:
            weights.rsi * 0.9,

          macd:
            weights.macd * 1.4,

          trend:
            weights.trend * 1.5,

          volatility:
            weights.volatility,

          alignment:
            weights.alignment * 1.3,

          momentum:
            weights.momentum * 1.5,
        },
      };
    }

    /*
    ==================================================
    SIDEWAYS MARKET
    ==================================================
    */

    else if (
      regime === "SIDEWAYS"
    ) {

      strategy = {

        mode: "MEAN_REVERSION",

        confidenceMultiplier: 0.9,

        thresholdAdjustment: 8,

        explorationBias: 0.4,

        positionSizingMultiplier: 0.7,

        featureBias: {

          rsi:
            weights.rsi * 1.5,

          macd:
            weights.macd * 0.6,

          trend:
            weights.trend * 0.5,

          volatility:
            weights.volatility,

          alignment:
            weights.alignment * 0.7,

          momentum:
            weights.momentum * 0.5,
        },
      };
    }

    /*
    ==================================================
    VOLATILE MARKET
    ==================================================
    */

    else if (
      volatilityRegime === "HIGH"
    ) {

      strategy = {

        mode: "DEFENSIVE",

        confidenceMultiplier: 0.8,

        thresholdAdjustment: 10,

        explorationBias: 0.15,

        positionSizingMultiplier: 0.5,

        featureBias: {

          rsi:
            weights.rsi,

          macd:
            weights.macd * 0.8,

          trend:
            weights.trend * 0.7,

          volatility:
            weights.volatility * 1.7,

          alignment:
            weights.alignment * 0.8,

          momentum:
            weights.momentum * 0.7,
        },
      };
    }

    /*
    ==================================================
    MOMENTUM OVERRIDE
    ==================================================
    */

    if (

      momentumState ===
      "BULLISH_ACCELERATION"

      ||

      momentumState ===
      "BEARISH_ACCELERATION"
    ) {

      strategy.confidenceMultiplier *= 1.1;

      strategy.featureBias.momentum *= 1.2;
    }

    /*
    ==================================================
    ROUNDING
    ==================================================
    */

    strategy.confidenceMultiplier =
      Number(
        strategy.confidenceMultiplier.toFixed(2)
      );

    strategy.positionSizingMultiplier =
      Number(
        strategy.positionSizingMultiplier.toFixed(2)
      );

    strategy.explorationBias =
      Number(
        strategy.explorationBias.toFixed(2)
      );

    /*
    ==================================================
    LOGGING
    ==================================================
    */

    console.log(`
==================================
REGIME STRATEGY ENGINE
==================================

Mode:
${strategy.mode}

Regime:
${regime}

Volatility:
${volatilityRegime}

Trend:
${trend}

Momentum:
${momentumState}

Confidence Multiplier:
${strategy.confidenceMultiplier}

Threshold Adjustment:
${strategy.thresholdAdjustment}

Exploration Bias:
${strategy.explorationBias}

Position Sizing:
${strategy.positionSizingMultiplier}

==================================
`);

    return strategy;

  } catch (err) {

    console.log(`
==================================
REGIME STRATEGY ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

    return {

      mode: "BALANCED",

      confidenceMultiplier: 1,

      thresholdAdjustment: 0,

      explorationBias: 0.3,

      positionSizingMultiplier: 1,

      featureBias: {},
    };
  }
}

module.exports = {
  getRegimeStrategy,
};
