/*
==================================================
ADAPTIVE TRADE DECISION ENGINE
==================================================
*/

function generateTradeDecision({

  trend,

  rsi,

  confidence,

  signalQuality,

  regime,

  volatilityRegime,

  alignmentScore = 0,

  overallTrend = "SIDEWAYS",

  momentumState = "NEUTRAL",
}) {

  try {

    /*
    ==================================================
    DEFAULT
    ==================================================
    */

    let action =
      "HOLD";

    let reason =
      "No valid setup";

    let explorationTrade =
      false;

    /*
    ==================================================
    HIGH CONFIDENCE BUY
    ==================================================
    */

    if (

      confidence >= 65

      &&

      trend === "BULLISH"

      &&

      (
        momentumState ===
        "BULLISH_ACCELERATION"

        ||

        overallTrend ===
        "BULLISH"
      )

    ) {

      action = "BUY";

      reason =
        "High confidence bullish setup";
    }

    /*
    ==================================================
    HIGH CONFIDENCE SELL
    ==================================================
    */

    else if (

      confidence >= 65

      &&

      trend === "BEARISH"

      &&

      (
        momentumState ===
        "BEARISH_ACCELERATION"

        ||

        overallTrend ===
        "BEARISH"
      )

    ) {

      action = "SELL";

      reason =
        "High confidence bearish setup";
    }

    /*
    ==================================================
    EXPLORATION MODE
    ==================================================
    */

    else if (

      confidence >= 45

      &&

      confidence < 65

      &&

      volatilityRegime ===
      "NORMAL"

      &&

      (
        momentumState ===
        "BULLISH_ACCELERATION"

        ||

        momentumState ===
        "BEARISH_ACCELERATION"
      )
    ) {

      /*
      ================================================
      RANDOMIZED EXPLORATION
      ================================================
      */

      const explorationChance =
        Math.random();

      /*
      35% chance
      */

      if (
        explorationChance <= 0.35
      ) {

        explorationTrade =
          true;

        if (
          momentumState ===
          "BULLISH_ACCELERATION"
        ) {

          action = "BUY";
        }

        else {

          action = "SELL";
        }

        reason =
          "Exploration learning trade";
      }
    }

    /*
    ==================================================
    CHAOTIC MARKET FILTER
    ==================================================
    */

    if (
      regime === "CHAOTIC"
    ) {

      action = "HOLD";

      reason =
        "Chaotic market blocked";
    }

    /*
    ==================================================
    EXTREME VOLATILITY FILTER
    ==================================================
    */

    if (
      volatilityRegime ===
      "EXTREME"
    ) {

      action = "HOLD";

      reason =
        "Extreme volatility blocked";
    }

    return {

      action,

      confidence,

      explorationTrade,

      reason,
    };

  } catch (err) {

    console.log(

      "Trade decision error:",

      err.message
    );

    return {

      action: "HOLD",

      confidence: 0,

      explorationTrade: false,

      reason: "Engine error",
    };
  }
}

module.exports = {
  generateTradeDecision,
};
