const {
  calculateAdaptiveConfidence,
} = require("./adaptiveConfidence");

const {
  getRegimeMemory,
} = require("./regimeMemory");

const {
  analyzeStrategyPerformance,
} = require("./strategyAnalytics");

const {
  predictOpportunity,
} = require("./opportunityPredictionEngine");

const {
  fuseEvidence,
} = require("./evidenceFusionEngine");

/*
==================================================
CROSS-MODEL CONSENSUS ENGINE
==================================================
*/

async function calculateConfidence({

  rsi,

  trend,

  regime,

  volatilityRegime,

  alignmentScore,

  momentumState,

  momentumStrength,

  overallTrend,

  marketState,

  decision = "HOLD",

opportunityScore = 50,

fusionScore = 50,
}) {

  try {

    /*
    ==================================================
    BASE CONFIDENCE
    ==================================================
    */

    let confidence = 30;

    /*
    ==================================================
    RSI
    ==================================================
    */

    if (
      rsi < 30
    ) {

      confidence += 15;
    }

    else if (
      rsi < 40
    ) {

      confidence += 8;
    }

    if (
      rsi > 70
    ) {

      confidence += 15;
    }

    else if (
      rsi > 60
    ) {

      confidence += 8;
    }

    /*
    ==================================================
    TREND
    ==================================================
    */

    if (
      trend === "BULLISH"
    ) {

      confidence += 10;
    }

    else if (
      trend === "BEARISH"
    ) {

      confidence += 10;
    }

    /*
    ==================================================
    REGIME
    ==================================================
    */

    if (
      regime === "TRENDING"
    ) {

      confidence += 10;
    }

    else if (
      regime === "VOLATILE"
    ) {

      confidence += 5;
    }

    /*
    ==================================================
    MULTI-TIMEFRAME ALIGNMENT
    ==================================================
    */

    if (
      alignmentScore >= 80
    ) {

      confidence += 15;
    }

    else if (
      alignmentScore >= 60
    ) {

      confidence += 8;
    }

    /*
    ==================================================
    MOMENTUM
    ==================================================
    */

    if (

      momentumState ===
      "BULLISH_ACCELERATION"

      ||

      momentumState ===
      "BEARISH_ACCELERATION"
    ) {

      confidence += 10;
    }

    /*
    ==================================================
    MOMENTUM STRENGTH
    ==================================================
    */

    if (
      momentumStrength >= 70
    ) {

      confidence += 10;
    }

    else if (
      momentumStrength >= 50
    ) {

      confidence += 5;
    }

    /*
    ==================================================
    BASE CLAMP
    ==================================================
    */

    confidence =

      Math.max(
        1,
        Math.min(
          confidence,
          95
        )
      );

    /*
    ==================================================
    ADAPTIVE CONFIDENCE
    ==================================================
    */

    const adaptive =
      await calculateAdaptiveConfidence({

        baseConfidence:
          confidence,

        trend,

        regime,

        volatilityRegime,

        momentumState,

        overallTrend,
      });

    /*
    ==================================================
    TEMPORAL MEMORY
    ==================================================
    */

    const memory =
      await getRegimeMemory({

        currentState:
          marketState,

        trend,

        volatilityRegime,

        momentumState,
      });

    let memoryBoost = 0;

    if (
      memory.found
    ) {

      for (
        const prediction of
        memory.predictions
      ) {

        memoryBoost +=

          (
            prediction.avgProbability
            || 0
          ) * 0.03;
      }
    }

    /*
    ==================================================
    STRATEGY EVOLUTION
    ==================================================
    */

    const analytics =
      await analyzeStrategyPerformance();

    const strategyKey =

      `${regime}_` +

      `${trend}_` +

      `${volatilityRegime}_` +

      `${momentumState}_` +

      `${decision}`;

    const strategy =

      analytics.strategies.find(

        s =>
          s.strategyKey ===
          strategyKey
      );

    let strategyBoost = 0;
/*
==================================================
OPPORTUNITY PREDICTION
==================================================
*/

const opportunityPrediction =
  predictOpportunity({

    fusionScore,

    liquidity:
      opportunityScore,

    momentum:
      momentumStrength,

    volatility:
      volatilityRegime === "HIGH"
        ? 90
        : volatilityRegime === "MEDIUM"
          ? 70
          : 50,

    confidence,

    discovery:
      alignmentScore,

    reinforcement:
      adaptive.reinforcementBoost,

    trend,

});
    if (strategy) {

      if (

        strategy.classification ===
        "PROMOTE"
      ) {

        strategyBoost =
  Math.min(
    strategy.evolutionScore * 0.02,
    3
  );
      }

      else if (

        strategy.classification ===
        "SUPPRESS"
      ) {

        strategyBoost =
  Math.max(
    -(strategy.evolutionScore * 0.03),
    -5
  );
      }
    }

    /*
==================================================
PREPARE EVIDENCE SCORES
==================================================
*/

const reinforcementScore =
  Math.max(
    0,
    Math.min(
      100,
      50 + adaptive.reinforcementBoost * 4
    )
  );

const strategyScore =
  strategy
    ? Math.max(
        0,
        Math.min(
          100,
          50 + strategyBoost * 10
        )
      )
    : 50;

const memoryScore =
  Math.max(
    0,
    Math.min(
      100,
      50 + memoryBoost * 8
    )
  );

    /*
    ==================================================
    CONSENSUS STRENGTH
    ==================================================
    */

    let consensusStrength = 0;

    /*
    Trend agreement
    */

    if (

      trend === overallTrend

      &&

      trend !== "SIDEWAYS"
    ) {

      consensusStrength += 25;
    }

    /*
    Momentum agreement
    */

    if (

      momentumState ===
      "BULLISH_ACCELERATION"

      ||

      momentumState ===
      "BEARISH_ACCELERATION"
    ) {

      consensusStrength += 20;
    }

    /*
    Strategy agreement
    */

    if (

      strategy

      &&

      strategy.classification ===
      "PROMOTE"
    ) {

      consensusStrength += 30;
    }

    /*
    Memory agreement
    */

    if (
      memory.found
    ) {

      consensusStrength += 15;
    }

    /*
    Reinforcement agreement
    */

    if (
      adaptive.reinforcementBoost > 0
    ) {

      consensusStrength += 10;
    }

    /*
    ==================================================
    CLAMPING
    ==================================================
    */

   consensusConfidence =

  Math.max(
    1,
    Math.min(
      consensusConfidence,
      99
    )
  );

if (
  strategy &&
  strategy.classification === "PROMOTE"
) {

  consensusConfidence =
    Math.min(
      consensusConfidence,
      92
    );

}

else if (
  strategy &&
  strategy.classification === "FAVOR"
) {

  consensusConfidence =
    Math.min(
      consensusConfidence,
      88
    );

}

else {

  consensusConfidence =
    Math.min(
      consensusConfidence,
      85
    );

}

    consensusStrength =

      Math.max(
        0,
        Math.min(
          consensusStrength,
          100
        )
      );

    consensusConfidence =
      Number(
        consensusConfidence.toFixed(2)
      );

    consensusStrength =
      Number(
        consensusStrength.toFixed(2)
      );
/*
==================================================
EVIDENCE FUSION
==================================================
*/

const fusion = fuseEvidence({

  mlConfidence:
    adaptive.adjustedConfidence,

  reinforcementScore,

  opportunityScore:
    opportunityPrediction.probability,

  strategyScore,

  memoryScore,

  alignmentScore,

  consensusStrength,

  sampleConfidence:
    Math.min(
      1,
      (
        adaptive.sampleSize || 0
      ) / 100
    ),

});

let consensusConfidence =
  fusion.confidence;
    /*
    ==================================================
    LOGGING
    ==================================================
    */

    console.log(`
==================================
CROSS-MODEL CONSENSUS ENGINE
==================================

Base Confidence:
${confidence}

Adaptive Confidence:
${adaptive.adjustedConfidence}

Memory Boost:
${memoryBoost.toFixed(2)}

Strategy Boost:
${strategyBoost.toFixed(2)}
Opportunity Probability:
${opportunityPrediction.probability}

Consensus Confidence:
${consensusConfidence}

Consensus Strength:
${consensusStrength}

Strategy:
${strategyKey}

==================================
`);

    return {

      confidence:
        consensusConfidence,

      consensusStrength,

      reinforcementBoost:
        adaptive.reinforcementBoost,

      memoryBoost:
        Number(
          memoryBoost.toFixed(2)
        ),

      strategyBoost:
        Number(
          strategyBoost.toFixed(2)
        ),
    };

  } catch (err) {

    console.log(`
==================================
CONSENSUS ENGINE ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

   
    return {

      confidence: 50,

      consensusStrength: 0,

      reinforcementBoost: 0,

      memoryBoost: 0,

      strategyBoost: 0,
    };
  }
}

module.exports = {
  calculateConfidence,
};
