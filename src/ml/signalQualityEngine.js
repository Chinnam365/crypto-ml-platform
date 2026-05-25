/*
==================================================
PROBABILISTIC SIGNAL QUALITY ENGINE
==================================================
*/

function calculateSignalQuality({

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
    SCORES
    ==================================================
    */

    let bullishScore = 0;

    let bearishScore = 0;

    let uncertaintyScore = 0;

    /*
    ==================================================
    TREND WEIGHT
    25%
    ==================================================
    */

    if (
      trend === "BULLISH"
    ) {

      bullishScore += 25;
    }

    else if (
      trend === "BEARISH"
    ) {

      bearishScore += 25;
    }

    else {

      uncertaintyScore += 15;
    }

    /*
    ==================================================
    MULTI TIMEFRAME ALIGNMENT
    20%
    ==================================================
    */

    if (
      alignmentScore >= 90
    ) {

      bullishScore += 20;
    }

    else if (
      alignmentScore >= 70
    ) {

      bullishScore += 15;
    }

    else {

      uncertaintyScore += 10;
    }

    /*
    ==================================================
    OVERALL TREND
    10%
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
    15%
    ==================================================
    */

    if (
      rsi >= 55 &&
      rsi <= 70
    ) {

      bullishScore += 15;
    }

    else if (
      rsi <= 45 &&
      rsi >= 30
    ) {

      bearishScore += 15;
    }

    else {

      uncertaintyScore += 10;
    }

    /*
    ==================================================
    MOMENTUM STATE
    25%
    ==================================================
    */

    if (
      momentumState ===
      "BULLISH_ACCELERATION"
    ) {

      bullishScore += 25;
    }

    else if (
      momentumState ===
      "BEARISH_ACCELERATION"
    ) {

      bearishScore += 25;
    }

    else if (

      momentumState ===
      "BULLISH_WEAKENING"

    ) {

      bullishScore += 10;

      uncertaintyScore += 10;
    }

    else if (

      momentumState ===
      "BEARISH_WEAKENING"

    ) {

      bearishScore += 10;

      uncertaintyScore += 10;
    }

    else {

      uncertaintyScore += 15;
    }

    /*
    ==================================================
    MOMENTUM STRENGTH
    10%
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
    15%
    ==================================================
    */

    if (
      volatilityRegime ===
      "NORMAL"
    ) {

      bullishScore += 15;
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
    FINAL CONFIDENCE
    ==================================================
    */

    const totalScore =

      bullishScore +

      bearishScore +

      uncertaintyScore;

    let confidence = 50;

    if (
      totalScore > 0
    ) {

      confidence =
        Math.max(

          bullishScore,

          bearishScore

        ) / totalScore * 100;
    }

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
    };
  }
}

module.exports = {
  calculateSignalQuality,
};
