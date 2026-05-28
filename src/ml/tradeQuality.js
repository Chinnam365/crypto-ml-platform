/*
==================================================
EXECUTION QUALITY INTELLIGENCE
==================================================
*/

function evaluateTradeQuality({

  confidence = 50,

  consensusStrength = 0,

  volatility = 1,

  regime = "SIDEWAYS",

  trend = "SIDEWAYS",

  momentumState = "NEUTRAL",

  alignmentScore = 50,

  volumeRatio = 1,
}) {

  try {

    /*
    ==================================================
    BASE QUALITY
    ==================================================
    */

    let qualityScore = 50;

    /*
    ==================================================
    CONFIDENCE
    ==================================================
    */

    qualityScore +=
      confidence * 0.25;

    /*
    ==================================================
    CONSENSUS
    ==================================================
    */

    qualityScore +=
      consensusStrength * 0.25;

    /*
    ==================================================
    ALIGNMENT
    ==================================================
    */

    qualityScore +=
      alignmentScore * 0.15;

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

      qualityScore += 10;
    }

    /*
    ==================================================
    TREND BONUS
    ==================================================
    */

    if (

      trend === "BULLISH"

      ||

      trend === "BEARISH"
    ) {

      qualityScore += 8;
    }

    /*
    ==================================================
    TRENDING REGIME BONUS
    ==================================================
    */

    if (
      regime === "TRENDING"
    ) {

      qualityScore += 10;
    }

    /*
    ==================================================
    SIDEWAYS PENALTY
    ==================================================
    */

    if (
      regime === "SIDEWAYS"
    ) {

      qualityScore -= 10;
    }

    /*
    ==================================================
    HIGH VOLATILITY PENALTY
    ==================================================
    */

    if (
      volatility >= 3
    ) {

      qualityScore -= 15;
    }

    /*
    ==================================================
    LOW LIQUIDITY PENALTY
    ==================================================
    */

    if (
      volumeRatio < 0.8
    ) {

      qualityScore -= 12;
    }

    /*
    ==================================================
    STRONG LIQUIDITY BONUS
    ==================================================
    */

    if (
      volumeRatio > 1.5
    ) {

      qualityScore += 8;
    }

    /*
    ==================================================
    CLAMP
    ==================================================
    */

    qualityScore =

      Math.max(
        1,
        Math.min(
          qualityScore,
          100
        )
      );

    qualityScore =
      Number(
        qualityScore.toFixed(2)
      );

    /*
    ==================================================
    EXECUTION PROFILE
    ==================================================
    */

    let executionProfile =
      "NORMAL";

    /*
    Aggressive execution
    */

    if (
      qualityScore >= 85
    ) {

      executionProfile =
        "AGGRESSIVE";
    }

    /*
    Conservative execution
    */

    else if (
      qualityScore <= 45
    ) {

      executionProfile =
        "DEFENSIVE";
    }

    /*
    ==================================================
    EXECUTION DELAY
    ==================================================
    */

    let executionDelay = 0;

    /*
    Delay entries in volatility
    */

    if (
      volatility >= 3
    ) {

      executionDelay = 5;
    }

    /*
    Delay weak setups
    */

    if (
      qualityScore < 55
    ) {

      executionDelay += 3;
    }

    /*
    ==================================================
    SLIPPAGE RISK
    ==================================================
    */

    let slippageRisk =
      "LOW";

    if (
      volatility >= 2.5
    ) {

      slippageRisk =
        "MEDIUM";
    }

    if (
      volatility >= 4
    ) {

      slippageRisk =
        "HIGH";
    }

    /*
    ==================================================
    LOGGING
    ==================================================
    */

    console.log(`
==================================
EXECUTION QUALITY INTELLIGENCE
==================================

Quality Score:
${qualityScore}

Execution Profile:
${executionProfile}

Execution Delay:
${executionDelay}s

Slippage Risk:
${slippageRisk}

Confidence:
${confidence}

Consensus Strength:
${consensusStrength}

Regime:
${regime}

Trend:
${trend}

Momentum:
${momentumState}

Volume Ratio:
${volumeRatio}

==================================
`);

    /*
    ==================================================
    RETURN
    ==================================================
    */

    return {

      qualityScore,

      executionProfile,

      executionDelay,

      slippageRisk,
    };

  } catch (err) {

    console.log(`
==================================
TRADE QUALITY ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

    return {

      qualityScore: 50,

      executionProfile:
        "NORMAL",

      executionDelay: 0,

      slippageRisk:
        "LOW",
    };
  }
}

module.exports = {
  evaluateTradeQuality,
};
