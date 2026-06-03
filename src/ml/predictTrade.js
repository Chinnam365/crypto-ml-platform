const brain =
  require("brain.js");

const {
  calculateSignalScores,
} = require("./probabilisticSignals");

const {
  getRegimeMemory,
} = require("./regimeMemory");

const {
  calculateAdaptiveConfidence,
} = require("./adaptiveConfidence");

const {
  calculateAdaptiveThreshold,
} = require("./adaptiveThreshold");

/*
==================================================
LOAD MODEL
==================================================
*/

let net = new brain.NeuralNetwork();

try {

  net =
    require("./modelStore");

} catch (err) {

  console.log(`
==================================
MODEL LOAD WARNING
==================================

Using fallback model

==================================
`);
}

/*
==================================================
ENSEMBLE PREDICTIVE ENGINE
==================================================
*/

async function predictTrade(features) {

  try {

    /*
    ==================================================
    ML PREDICTION
    ==================================================
    */

    const mlOutput =
      net.run({

        rsi:
          features.rsi / 100,

        macd:
          features.macd / 10,

        volatility:
          features.volatility / 10,

        confidence:
          features.confidence / 100,
      });

    const mlProbability =

      Number(
        (
          (mlOutput.buy || 0)
          * 100
        ).toFixed(2)
      );

    /*
    ==================================================
    PROBABILISTIC ENGINE
    ==================================================
    */

    const probabilistic =
      await calculateSignalScores({

        rsi:
          features.rsi,

        macd:
          features.macd,

        trend:
          features.trend,

        regime:
          features.regime,

        multiTf: {

          overallTrend:
            features.overallTrend,
        },

        volatilityRegime:
          features.volatilityRegime,

        momentumState:
          features.momentumState,
      });

    /*
    ==================================================
    TEMPORAL MARKET MEMORY
    ==================================================
    */

    const memory =
      await getRegimeMemory({

        currentState:
          features.marketState,

        trend:
          features.trend,

        volatilityRegime:
          features.volatilityRegime,

        momentumState:
          features.momentumState,
      });

    /*
    ==================================================
    MEMORY CONFIDENCE
    ==================================================
    */

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
          ) * 0.05;
      }
    }

    /*
    ==================================================
    ADAPTIVE CONFIDENCE
    ==================================================
    */

    const adaptive =
      await calculateAdaptiveConfidence({

        baseConfidence:
          features.confidence,

        trend:
          features.trend,

        regime:
          features.regime,

        volatilityRegime:
          features.volatilityRegime,

        momentumState:
          features.momentumState,

        overallTrend:
          features.overallTrend,
      });

    /*
    ==================================================
    FINAL ENSEMBLE CONFIDENCE
    ==================================================
    */

    let ensembleConfidence =

      (
  mlProbability * 0.20
)

+

(
  probabilistic.buyScore * 0.30
)

+

(
  adaptive.adjustedConfidence * 0.50
)
      +

      (
        memoryBoost
      );

    ensembleConfidence =
      Number(
        ensembleConfidence.toFixed(2)
      );

    /*
    ==================================================
    ADAPTIVE THRESHOLD
    ==================================================
    */

    const thresholdData =
      await calculateAdaptiveThreshold({

        baseThreshold: 52,

        regime:
          features.regime,

        volatilityRegime:
          features.volatilityRegime,

        trend:
          features.trend,

        momentumState:
          features.momentumState,

        performanceScore:
          adaptive.reinforcementBoost,
      });

    const adaptiveThreshold =
      thresholdData.threshold;

    /*
    ==================================================
    FINAL DECISION
    ==================================================
    */

    let decision = "HOLD";

    if (

      ensembleConfidence >=
      adaptiveThreshold
    ) {

      if (

        probabilistic.buyScore >
        probabilistic.sellScore
      ) {

        decision = "BUY";
      }

      else if (

        probabilistic.sellScore >
        probabilistic.buyScore
      ) {

        decision = "SELL";
      }
    }

    /*
    ==================================================
    LOGGING
    ==================================================
    */

    console.log(`
==================================
ENSEMBLE PREDICTIVE ENGINE
==================================

ML Probability:
${mlProbability}

Buy Score:
${probabilistic.buyScore}

Sell Score:
${probabilistic.sellScore}

Adaptive Confidence:
${adaptive.adjustedConfidence}

Memory Boost:
${memoryBoost.toFixed(2)}

Ensemble Confidence:
${ensembleConfidence}

Adaptive Threshold:
${adaptiveThreshold}

Decision:
${decision}

==================================
`);

    return {

      decision,

      confidence:
        ensembleConfidence,

      threshold:
        adaptiveThreshold,

      mlProbability,

      buyScore:
        probabilistic.buyScore,

      sellScore:
        probabilistic.sellScore,

      adaptiveConfidence:
        adaptive.adjustedConfidence,

      memoryBoost:
        Number(
          memoryBoost.toFixed(2)
        ),
    };

  } catch (err) {

    console.log(`
==================================
ENSEMBLE PREDICTION ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

    return {

      decision: "HOLD",

      confidence: 50,

      threshold: 57,

      mlProbability: 0,

      buyScore: 0,

      sellScore: 0,

      adaptiveConfidence: 50,

      memoryBoost: 0,
    };
  }
}

module.exports = {
  predictTrade,
};
