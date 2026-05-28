/*
==================================================
AUTONOMOUS RISK EVOLUTION ENGINE
==================================================
*/

function evaluateRiskEnvironment({

  confidence = 50,

  consensusStrength = 0,

  qualityScore = 50,

  volatility = 1,

  regime = "SIDEWAYS",

  trend = "SIDEWAYS",

  drawdownPercent = 0,

  portfolioRiskScore = 0,

  slippageRisk = "LOW",

  executionProfile = "NORMAL",
}) {

  try {

    /*
    ==================================================
    BASE RISK SCORE
    ==================================================
    */

    let riskScore = 50;

    /*
    ==================================================
    CONFIDENCE
    ==================================================
    */

    riskScore -=
      confidence * 0.20;

    /*
    ==================================================
    CONSENSUS
    ==================================================
    */

    riskScore -=
      consensusStrength * 0.15;

    /*
    ==================================================
    EXECUTION QUALITY
    ==================================================
    */

    riskScore -=
      qualityScore * 0.15;

    /*
    ==================================================
    VOLATILITY
    ==================================================
    */

    riskScore +=
      volatility * 8;

    /*
    ==================================================
    DRAWDOWN
    ==================================================
    */

    riskScore +=
      drawdownPercent * 1.5;

    /*
    ==================================================
    PORTFOLIO RISK
    ==================================================
    */

    riskScore +=
      portfolioRiskScore * 0.30;

    /*
    ==================================================
    SIDEWAYS PENALTY
    ==================================================
    */

    if (
      regime === "SIDEWAYS"
    ) {

      riskScore += 8;
    }

    /*
    ==================================================
    TRENDING BONUS
    ==================================================
    */

    if (
      regime === "TRENDING"
    ) {

      riskScore -= 5;
    }

    /*
    ==================================================
    SLIPPAGE RISK
    ==================================================
    */

    if (
      slippageRisk === "MEDIUM"
    ) {

      riskScore += 10;
    }

    else if (
      slippageRisk === "HIGH"
    ) {

      riskScore += 20;
    }

    /*
    ==================================================
    EXECUTION PROFILE
    ==================================================
    */

    if (
      executionProfile ===
      "DEFENSIVE"
    ) {

      riskScore += 8;
    }

    else if (
      executionProfile ===
      "AGGRESSIVE"
    ) {

      riskScore -= 5;
    }

    /*
    ==================================================
    TREND CONFIRMATION
    ==================================================
    */

    if (

      trend === "BULLISH"

      ||

      trend === "BEARISH"
    ) {

      riskScore -= 4;
    }

    /*
    ==================================================
    CLAMP
    ==================================================
    */

    riskScore =

      Math.max(
        1,
        Math.min(
          riskScore,
          100
        )
      );

    riskScore =
      Number(
        riskScore.toFixed(2)
      );

    /*
    ==================================================
    RISK MODE
    ==================================================
    */

    let riskMode =
      "NORMAL";

    /*
    Critical defense
    */

    if (
      riskScore >= 80
    ) {

      riskMode =
        "CAPITAL_PRESERVATION";
    }

    /*
    Defensive
    */

    else if (
      riskScore >= 65
    ) {

      riskMode =
        "DEFENSIVE";
    }

    /*
    Aggressive
    */

    else if (
      riskScore <= 30
    ) {

      riskMode =
        "AGGRESSIVE";
    }

    /*
    ==================================================
    EXPOSURE MULTIPLIER
    ==================================================
    */

    let exposureMultiplier = 1;

    if (
      riskMode ===
      "CAPITAL_PRESERVATION"
    ) {

      exposureMultiplier = 0.3;
    }

    else if (
      riskMode ===
      "DEFENSIVE"
    ) {

      exposureMultiplier = 0.6;
    }

    else if (
      riskMode ===
      "AGGRESSIVE"
    ) {

      exposureMultiplier = 1.4;
    }

    /*
    ==================================================
    TRADE FREQUENCY
    ==================================================
    */

    let tradeFrequency =
      "NORMAL";

    if (
      riskMode ===
      "CAPITAL_PRESERVATION"
    ) {

      tradeFrequency =
        "MINIMAL";
    }

    else if (
      riskMode ===
      "DEFENSIVE"
    ) {

      tradeFrequency =
        "REDUCED";
    }

    else if (
      riskMode ===
      "AGGRESSIVE"
    ) {

      tradeFrequency =
        "HIGH";
    }

    /*
    ==================================================
    AUTONOMOUS RISK RESPONSE
    ==================================================
    */

    let allowNewTrades =
      true;

    if (
      riskScore >= 90
    ) {

      allowNewTrades =
        false;
    }

    /*
    ==================================================
    LOGGING
    ==================================================
    */

    console.log(`
==================================
AUTONOMOUS RISK EVOLUTION
==================================

Risk Score:
${riskScore}

Risk Mode:
${riskMode}

Exposure Multiplier:
${exposureMultiplier}

Trade Frequency:
${tradeFrequency}

Allow New Trades:
${allowNewTrades}

Confidence:
${confidence}

Consensus Strength:
${consensusStrength}

Quality Score:
${qualityScore}

Volatility:
${volatility}

Drawdown:
${drawdownPercent}

Portfolio Risk:
${portfolioRiskScore}

Slippage Risk:
${slippageRisk}

Execution Profile:
${executionProfile}

==================================
`);

    /*
    ==================================================
    RETURN
    ==================================================
    */

    return {

      riskScore,

      riskMode,

      exposureMultiplier,

      tradeFrequency,

      allowNewTrades,
    };

  } catch (err) {

    console.log(`
==================================
RISK EVOLUTION ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

    return {

      riskScore: 50,

      riskMode: "NORMAL",

      exposureMultiplier: 1,

      tradeFrequency: "NORMAL",

      allowNewTrades: true,
    };
  }
}

module.exports = {
  evaluateRiskEnvironment,
};
