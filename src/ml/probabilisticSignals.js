const {
  getAdaptiveWeights,
} = require("./adaptiveWeights");

/*
==================================================
PROBABILISTIC SIGNAL ENGINE
==================================================
*/

async function calculateSignalScores({

  rsi = 50,

  macd = 0,

  trend = "SIDEWAYS",

  regime = "SIDEWAYS",

  multiTf = {},

  volatilityRegime = "NORMAL",

  momentumState = "NEUTRAL",
} = {}) {

  try {

    /*
    ==================================================
    LOAD ADAPTIVE WEIGHTS
    ==================================================
    */

    const weights =
      await getAdaptiveWeights({

        regime,

        trend,

        volatilityRegime,

        momentumState,

        decision: "HOLD",
      });

    let buyScore = 0;

    let sellScore = 0;

    /*
==================================================
RSI
==================================================
*/

if (rsi < 30) {

  buyScore +=
    35 * weights.rsi;
}

else if (rsi < 40) {

  buyScore +=
    25 * weights.rsi;
}

else if (rsi < 50) {

  buyScore +=
    15 * weights.rsi;
}

if (rsi > 70) {

  sellScore +=
    35 * weights.rsi;
}

else if (rsi > 60) {

  sellScore +=
    25 * weights.rsi;
}

else if (rsi > 50) {

  sellScore +=
    15 * weights.rsi;
}

    /*
    ==================================================
    MACD
    ==================================================
    */

    if (macd > 0.5) {

      buyScore +=
        25 * weights.macd;
    }

    else if (macd > 0) {

      buyScore +=
        15 * weights.macd;
    }

    if (macd < -0.5) {

      sellScore +=
        25 * weights.macd;
    }

    else if (macd < 0) {

      sellScore +=
        15 * weights.macd;
    }

    /*
    ==================================================
    TREND
    ==================================================
    */

    if (trend === "BULLISH") {

      buyScore +=
        25 * weights.trend;
    }

    else if (
      trend === "BEARISH"
    ) {

      sellScore +=
        25 * weights.trend;
    }

    /*
    ==================================================
    VOLATILITY
    ==================================================
    */

    if (
      volatilityRegime === "HIGH"
    ) {

      buyScore +=
        10 * weights.volatility;

      sellScore +=
        10 * weights.volatility;
    }

    /*
    ==================================================
    MULTI TIMEFRAME
    ==================================================
    */

    if (

      multiTf?.overallTrend ===
      "BULLISH"

    ) {

      buyScore +=
        25 * weights.alignment;
    }

    else if (

      multiTf?.overallTrend ===
      "BEARISH"

    ) {

      sellScore +=
        25 * weights.alignment;
    }

    /*
    ==================================================
    MOMENTUM
    ==================================================
    */

    if (

      momentumState ===
      "BULLISH_ACCELERATION"
    ) {

      buyScore +=
        20 * weights.momentum;
    }

    else if (

      momentumState ===
      "BEARISH_ACCELERATION"
    ) {

      sellScore +=
        20 * weights.momentum;
    }

    /*
    ==================================================
    TREND ALIGNMENT BONUS
    ==================================================
    */

    if (

      trend === "BULLISH"

      &&

      multiTf?.overallTrend ===
      "BULLISH"

    ) {

      buyScore += 15;
    }

    if (

      trend === "BEARISH"

      &&

      multiTf?.overallTrend ===
      "BEARISH"

    ) {

      sellScore += 15;
    }

    /*
    ==================================================
    SIDEWAYS PENALTY
    ==================================================
    */

    if (
      trend === "SIDEWAYS"
    ) {

      buyScore -= 5;

      sellScore -= 5;
    }

    /*
    ==================================================
    ROUNDING
    ==================================================
    */

    buyScore =
      Math.max(
        0,
        Math.round(buyScore)
      );

    sellScore =
      Math.max(
        0,
        Math.round(sellScore)
      );

    /*
    ==================================================
    FINAL DECISION
    ==================================================
    */

    let decision = "HOLD";

    if (

      buyScore >= 30

      &&

      buyScore >
      sellScore

    ) {

      decision = "BUY";
    }

    else if (

      sellScore >= 30

      &&

      sellScore >
      buyScore

    ) {

      decision = "SELL";
    }

    /*
    ==================================================
    LOGGING
    ==================================================
    */

    console.log(`
==================================
PROBABILISTIC SIGNAL ENGINE
==================================

RSI:
${rsi}

MACD:
${macd}

Trend:
${trend}

Regime:
${regime}

Momentum:
${momentumState}

Weights:
${JSON.stringify(weights)}

Buy Score:
${buyScore}

Sell Score:
${sellScore}

Decision:
${decision}

==================================
`);

    return {

      buyScore,

      sellScore,

      decision,

      weights,
    };

  } catch (err) {

    console.log(`
==================================
PROBABILISTIC SIGNAL ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

    return {

      buyScore: 0,

      sellScore: 0,

      decision: "HOLD",

      weights: {

        rsi: 1,

        macd: 1,

        trend: 1,

        volatility: 1,

        alignment: 1,

        momentum: 1,
      },
    };
  }
}

module.exports = {
  calculateSignalScores,
};
