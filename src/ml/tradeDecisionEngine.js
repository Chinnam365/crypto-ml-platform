const {
  optimizeSystemBehavior,
} = require("./selfOptimizer");

/*
==================================================
TRADE DECISION ENGINE
==================================================
*/

async function generateTradeDecision({

  trend,

  rsi,

  confidence,

  signalQuality,

  regime,

  volatilityRegime,

  alignmentScore,

  overallTrend,

  momentumState,
}) {

  try {

    /*
    ==================================================
    SYSTEM OPTIMIZATION
    ==================================================
    */

    const optimizer =
      await optimizeSystemBehavior();

    /*
    ==================================================
    APPLY CONFIDENCE MULTIPLIER
    ==================================================
    */

    let adjustedConfidence =

      confidence *
      optimizer.confidenceMultiplier;

    adjustedConfidence =
      Number(
        adjustedConfidence.toFixed(2)
      );

    /*
    ==================================================
    EXPLORATION LOGIC
    ==================================================
    */

    const explorationTrade =

      Math.random() <
      optimizer.explorationRate;

    /*
    ==================================================
    BASE DECISION
    ==================================================
    */

    let action = "HOLD";

    /*
    ==================================================
    BUY CONDITIONS
    ==================================================
    */

    const bullishConditions = [

      trend === "BULLISH",

      rsi < 65,

      adjustedConfidence >=
        (
          65 +
          optimizer.thresholdAdjustment
        ),

      signalQuality !== "LOW",

      overallTrend !== "BEARISH",
    ];

    const bullishScore =

      bullishConditions.filter(
        Boolean
      ).length;

    /*
    ==================================================
    SELL CONDITIONS
    ==================================================
    */

    const bearishConditions = [

      trend === "BEARISH",

      rsi > 35,

      adjustedConfidence >=
        (
          65 +
          optimizer.thresholdAdjustment
        ),

      signalQuality !== "LOW",

      overallTrend !== "BULLISH",
    ];

    const bearishScore =

      bearishConditions.filter(
        Boolean
      ).length;

    /*
    ==================================================
    MOMENTUM BONUS
    ==================================================
    */

    let momentumBonus = 0;

    if (

      momentumState ===
      "BULLISH_ACCELERATION"

      ||

      momentumState ===
      "BEARISH_ACCELERATION"
    ) {

      momentumBonus = 1;
    }

    /*
    ==================================================
    ALIGNMENT BONUS
    ==================================================
    */

    let alignmentBonus = 0;

    if (
      alignmentScore >= 70
    ) {

      alignmentBonus = 1;
    }

    /*
    ==================================================
    FINAL SCORES
    ==================================================
    */

    const finalBullishScore =

      bullishScore +
      momentumBonus +
      alignmentBonus;

    const finalBearishScore =

      bearishScore +
      momentumBonus +
      alignmentBonus;

    /*
    ==================================================
    DECISION LOGIC
    ==================================================
    */

    if (
      finalBullishScore >= 5
    ) {

      action = "BUY";
    }

    else if (
      finalBearishScore >= 5
    ) {

      action = "SELL";
    }

    /*
    ==================================================
    EXPLORATION OVERRIDE
    ==================================================
    */

    if (

      explorationTrade

      &&

      adjustedConfidence >= 45

      &&

      action === "HOLD"
    ) {

      if (
        trend === "BULLISH"
      ) {

        action = "BUY";
      }

      else if (
        trend === "BEARISH"
      ) {

        action = "SELL";
      }
    }

    /*
    ==================================================
    DEFENSIVE VOLATILITY FILTER
    ==================================================
    */

if (
  volatilityRegime === "HIGH"

  &&

  adjustedConfidence < 55
) {

  action = "HOLD";
}

    /*
    ==================================================
    SIDEWAYS FILTER
    ==================================================
    */

    if (

      regime === "SIDEWAYS"

      &&

      adjustedConfidence < 50
    ) {

      action = "HOLD";
    }

    /*
    ==================================================
    LOGGING
    ==================================================
    */

    console.log(`
==================================
TRADE DECISION ENGINE
==================================

Action:
${action}

Base Confidence:
${confidence}

Adjusted Confidence:
${adjustedConfidence}

Bullish Score:
${finalBullishScore}

Bearish Score:
${finalBearishScore}

Exploration Trade:
${explorationTrade}

Exploration Rate:
${optimizer.explorationRate}

Exploitation Rate:
${optimizer.exploitationRate}

Threshold Adjustment:
${optimizer.thresholdAdjustment}

==================================
`);

    return {

      action,

      explorationTrade,

      adjustedConfidence,

      explorationRate:
        optimizer.explorationRate,

      exploitationRate:
        optimizer.exploitationRate,
    };

  } catch (err) {

    console.log(`
==================================
TRADE DECISION ENGINE ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

    return {

      action: "HOLD",

      explorationTrade: false,

      adjustedConfidence:
        confidence || 50,

      explorationRate: 0.3,

      exploitationRate: 0.7,
    };
  }
}

module.exports = {
  generateTradeDecision,
};
