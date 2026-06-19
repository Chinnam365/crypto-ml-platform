const {
  analyzeStrategyPerformance,
} = require("./strategyAnalytics");

/*
==================================================
STRATEGY-AWARE ADAPTIVE WEIGHTS
==================================================
*/

async function getAdaptiveWeights(
  {

    regime = "SIDEWAYS",

    trend = "SIDEWAYS",

    volatilityRegime = "NORMAL",

    momentumState = "NEUTRAL",

    decision = "HOLD",

  } = {}
) {

  try {

    /*
    ==================================================
    BASE WEIGHTS
    ==================================================
    */

    let weights = {

      rsi: 1,

      macd: 1,

      trend: 1,

      volatility: 1,

      alignment: 1,

      momentum: 1,
    };

    /*
    ==================================================
    LOAD STRATEGY EVOLUTION
    ==================================================
    */

    const analytics =
      await analyzeStrategyPerformance();

    /*
    ==================================================
    SAFETY
    ==================================================
    */

    if (
      !analytics ||
      !analytics.strategies ||
      !Array.isArray(
        analytics.strategies
      )
    ) {

      return {

  weights,

  classification:
    strategy.classification,

  strategyKey,

  evolutionScore:
    strategy.evolutionScore
};
    }

    /*
    ==================================================
    STRATEGY SIGNATURE
    ==================================================
    */

    const strategyKey =

      `${regime}_` +

      `${trend}_` +

      `${volatilityRegime}_` +

      `${momentumState}_` +

      `${decision}`;

    /*
    ==================================================
    FIND MATCHING STRATEGY
    ==================================================
    */

    const strategy =

      analytics.strategies.find(

        s =>

          s.strategyKey ===
          strategyKey
      );

    /*
    ==================================================
    NO MATCH
    ==================================================
    */

    if (!strategy) {

      return weights;
    }

    /*
    ==================================================
    PROMOTED STRATEGY
    ==================================================
    */

    if (

      strategy.classification ===
      "PROMOTE"
    ) {

      weights = {

        rsi: 1.2,

        macd: 1.5,

        trend: 1.6,

        volatility: 1.1,

        alignment: 1.4,

        momentum: 1.5,
      };
    }

    /*
    ==================================================
    SUPPRESSED STRATEGY
    ==================================================
    */

    else if (

      strategy.classification ===
      "SUPPRESS"
    ) {

      weights = {

        rsi: 0.8,

        macd: 0.7,

        trend: 0.7,

        volatility: 1.0,

        alignment: 0.7,

        momentum: 0.6,
      };
    }

    /*
    ==================================================
    EVOLUTION BOOST
    ==================================================
    */

    const evolutionBoost =

      Math.max(
  0.75,
  Number(
    strategy.evolutionScore || 100
  ) / 100
);

    weights.rsi *= evolutionBoost;

    weights.macd *= evolutionBoost;

    weights.trend *= evolutionBoost;

    weights.volatility *= evolutionBoost;

    weights.alignment *= evolutionBoost;

    weights.momentum *= evolutionBoost;

    /*
    ==================================================
    CLAMP
    ==================================================
    */

    for (
      const key of
      Object.keys(weights)
    ) {

      weights[key] =

  Math.max(
    0.8,

    Math.min(
      Number(
        weights[key].toFixed(2)
      ),

      3
    )
  );
    }

    /*
    ==================================================
    LOGGING
    ==================================================
    */

    console.log(`
==================================
STRATEGY-AWARE WEIGHTS
==================================

Strategy:
${strategyKey}

Classification:
${strategy.classification}

Evolution Score:
${strategy.evolutionScore}

Weights:
${JSON.stringify(weights)}

==================================
`);

console.log(`
==================================
WEIGHT FLOOR ACTIVE
==================================

Minimum Weight:
0.8

Weights:
${JSON.stringify(weights)}

==================================
`);

return weights;
  } catch (err) {

    console.log(`
==================================
ADAPTIVE WEIGHT ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

    return {

      rsi: 1,

      macd: 1,

      trend: 1,

      volatility: 1,

      alignment: 1,

      momentum: 1,
    };
  }
}

module.exports = {
  getAdaptiveWeights,
};
