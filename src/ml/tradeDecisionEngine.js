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

   let bullishMomentumBonus = 0;
let bearishMomentumBonus = 0;

if (
  momentumState ===
  "BULLISH_ACCELERATION"
) {
  bullishMomentumBonus = 1;
}

if (
  momentumState ===
  "BEARISH_ACCELERATION"
) {
  bearishMomentumBonus = 1;
}

const finalBullishScore =
  bullishScore +
  bullishMomentumBonus +
  alignmentBonus;

const finalBearishScore =
  bearishScore +
  bearishMomentumBonus +
  alignmentBonus;

    /*
    ==================================================
    DECISION LOGIC
    ==================================================
    */
console.log(`
==================================
DECISION DEBUG
==================================

Bullish Conditions:
${JSON.stringify(bullishConditions)}

Bearish Conditions:
${JSON.stringify(bearishConditions)}

Bullish Score:
${bullishScore}

Bearish Score:
${bearishScore}

==================================
`);
    if (
  finalBullishScore >= 5 &&
  finalBullishScore > finalBearishScore
) {

  action = "BUY";
}

else if (
  finalBearishScore >= 5 &&
  finalBearishScore > finalBullishScore
) {

  action = "SELL";
}

else {

  action = "HOLD";
}

    /*
    ==================================================
    EXPLORATION OVERRIDE
    ==================================================
    */

    if (

      explorationTrade

      &&

      adjustedConfidence >= 75

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

Trend:
${trend}

RSI:
${rsi}

Signal Quality:
${signalQuality}

Overall Trend:
${overallTrend}

Momentum:
${momentumState}

Alignment:
${alignmentScore}

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
