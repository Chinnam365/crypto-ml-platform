const {
  calculateAdaptiveConfidence,
} = require("./adaptiveConfidence");

/*
==================================================
CONFIDENCE ENGINE
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
}) {

  try {

    let confidence = 50;

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
    MULTI TIMEFRAME ALIGNMENT
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
    CLAMP BASE
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
    ADAPTIVE CONTEXTUAL LEARNING
    ==================================================
    */

    const adaptiveData =
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
    FINAL CONFIDENCE
    ==================================================
    */

    const finalConfidence =

      adaptiveData.adjustedConfidence;

    console.log(`
==================================
CONFIDENCE ENGINE
==================================

Base Confidence:
${confidence}

Adaptive Confidence:
${finalConfidence}

Reinforcement Boost:
${adaptiveData.reinforcementBoost}

Sample Size:
${adaptiveData.sampleSize}

==================================
`);

    return {

      confidence:
        finalConfidence,

      reinforcementBoost:
        adaptiveData.reinforcementBoost,

      reinforcementSamples:
        adaptiveData.sampleSize,
    };

  } catch (err) {

    console.log(`
==================================
CONFIDENCE ENGINE ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

    return {

      confidence: 50,

      reinforcementBoost: 0,

      reinforcementSamples: 0,
    };
  }
}

module.exports = {
  calculateConfidence,
};
