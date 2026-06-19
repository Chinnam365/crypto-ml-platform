const {
  getAdaptiveWeights,
} = require("./adaptiveWeights");

/*
==================================================
ADAPTIVE PROBABILISTIC SIGNAL ENGINE
==================================================
*/

async function calculateSignalQuality({

  rsi,

  trend,

  regime,

  volatilityRegime,

  emaDistance,

  alignmentScore = 0,

  overallTrend = "SIDEWAYS",

  momentumState = "NEUTRAL",

  momentumStrength = 0,
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
    SCORES
    ==================================================
    */

    let bullishScore = 0;

    let bearishScore = 0;

    let uncertaintyScore = 0;

    /*
    ==================================================
    TREND
    ==================================================
    */

    if (
      trend === "BULLISH"
    ) {

      bullishScore +=
        weights.trend;
    }

    else if (
      trend === "BEARISH"
    ) {

      bearishScore +=
        weights.trend;
    }

    else {

      uncertaintyScore += 15;
    }

    /*
    ==================================================
    MULTI TIMEFRAME ALIGNMENT
    ==================================================
    */

    if (
      alignmentScore >= 90
    ) {

      bullishScore +=
        weights.alignment;
    }

    else if (
      alignmentScore >= 70
    ) {

      bullishScore +=
        weights.alignment * 0.75;
    }

    else {

      uncertaintyScore += 10;
    }

    /*
    ==================================================
    OVERALL TREND
    ==================================================
    */

    if (
      overallTrend === "BULLISH"
    ) {

      bullishScore += 10;
    }

    else if (
      overallTrend === "BEARISH"
    ) {

      bearishScore += 10;
    }

    else {

      uncertaintyScore += 5;
    }

    /*
    ==================================================
    RSI CONTEXT
    ==================================================
    */

    if (
      rsi >= 55 &&
      rsi <= 70
    ) {

      bullishScore +=
        weights.rsi;
    }

    else if (
      rsi <= 45 &&
      rsi >= 30
    ) {

      bearishScore +=
        weights.rsi;
    }

    else {

      uncertaintyScore += 10;
    }

    /*
    ==================================================
    MOMENTUM STATE
    ==================================================
    */

    if (
      momentumState ===
      "BULLISH_ACCELERATION"
    ) {

      bullishScore +=
        weights.momentum;
    }

    else if (
      momentumState ===
      "BEARISH_ACCELERATION"
    ) {

      bearishScore +=
        weights.momentum;
    }

    else if (

      momentumState ===
      "BULLISH_WEAKENING"

    ) {

      bullishScore +=
        weights.momentum * 0.4;

      uncertaintyScore += 10;
    }

    else if (

      momentumState ===
      "BEARISH_WEAKENING"

    ) {

      bearishScore +=
        weights.momentum * 0.4;

      uncertaintyScore += 10;
    }

    else {

      uncertaintyScore += 15;
    }

    /*
    ==================================================
    MOMENTUM STRENGTH
    ==================================================
    */

    if (
      momentumStrength >= 70
    ) {

      bullishScore += 10;
    }

    else if (
      momentumStrength <= 30
    ) {

      uncertaintyScore += 10;
    }

    /*
    ==================================================
    VOLATILITY
    ==================================================
    */

    if (
      volatilityRegime ===
      "NORMAL"
    ) {

      bullishScore +=
        weights.volatility;
    }

    else if (
      volatilityRegime ===
      "HIGH"
    ) {

      uncertaintyScore += 15;
    }

    else if (
      volatilityRegime ===
      "LOW"
    ) {

      uncertaintyScore += 10;
    }

    /*
    ==================================================
    EMA DISTANCE
    ==================================================
    */

    if (
      Math.abs(emaDistance) > 1.5
    ) {

      uncertaintyScore += 10;
    }

    /*
    ==================================================
    REGIME ANALYSIS
    ==================================================
    */

    if (
      regime === "TRENDING"
    ) {

      bullishScore += 5;
    }

    else if (
      regime === "CHAOTIC"
    ) {

      uncertaintyScore += 15;
    }

    /*
    ==================================================
    FINAL CONFIDENCE
    ==================================================
    */

    const totalScore =

  bullishScore +

  bearishScore;

    let confidence = 50;

    if (
      totalScore > 0
    ) {

      confidence =
(
  Math.max(
    bullishScore,
    bearishScore
  ) /

  Math.max(
    1,
    bullishScore +
    bearishScore
  )
) * 100;
    }
confidence -=
  uncertaintyScore * 0.15;

confidence =
  Math.max(
    10,
    Math.min(
      confidence,
      95
    )
  );
    confidence =
      Number(
        confidence.toFixed(2)
      );

    /*
    ==================================================
    SIGNAL QUALITY
    ==================================================
    */

    let quality =
      "LOW";

    if (
      confidence >= 75
    ) {

      quality = "HIGH";
    }

    else if (
      confidence >= 60
    ) {

      quality = "MEDIUM";
    }

    /*
    ==================================================
    MARKET BIAS
    ==================================================
    */

    let marketBias =
      "NEUTRAL";

    if (
      bullishScore >
      bearishScore
    ) {

      marketBias =
        "BULLISH";
    }

    else if (
      bearishScore >
      bullishScore
    ) {

      marketBias =
        "BEARISH";
    }

    /*
    ==================================================
    RETURN
    ==================================================
    */

    return {

      confidence,

      quality,

      bullishScore:
        Number(
          bullishScore.toFixed(2)
        ),

      bearishScore:
        Number(
          bearishScore.toFixed(2)
        ),

      uncertaintyScore:
        Number(
          uncertaintyScore.toFixed(2)
        ),

      marketBias,

      adaptiveWeights:
        weights,
    };

  } catch (err) {

    console.log(

      "Signal quality error:",

      err.message
    );

    return {

      confidence: 50,

      quality: "LOW",

      bullishScore: 0,

      bearishScore: 0,

      uncertaintyScore: 100,

      marketBias: "NEUTRAL",

      adaptiveWeights: {

        trend: 25,

        momentum: 25,

        alignment: 20,

        volatility: 15,

        rsi: 15,
      },
    };
  }
}

module.exports = {
  calculateSignalQuality,
};
