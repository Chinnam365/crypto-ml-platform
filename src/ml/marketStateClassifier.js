/*
==================================================
MARKET STATE CLASSIFIER
==================================================
*/

function classifyMarketState({

  trend,

  regime,

  volatility,

  momentumState,

  momentumStrength,

  alignmentScore,
}) {

  try {

    /*
    ==================================================
    LOW ACTIVITY
    ==================================================
    */

    if (

      volatility < 1

      &&

      regime === "SIDEWAYS"

    ) {

      return "LOW_ACTIVITY";
    }

    /*
    ==================================================
    BREAKOUT SETUP
    ==================================================
    */

    if (

      volatility < 2

      &&

      alignmentScore >= 70

      &&

      momentumStrength >= 50

    ) {

      return "BREAKOUT_SETUP";
    }

    /*
    ==================================================
    TREND EXPANSION
    ==================================================
    */

    if (

      trend === "BULLISH"

      &&

      regime === "TRENDING"

      &&

      momentumState ===
      "BULLISH_ACCELERATION"

    ) {

      return "TREND_EXPANSION";
    }

    /*
    ==================================================
    PANIC SELLING
    ==================================================
    */

    if (

      trend === "BEARISH"

      &&

      momentumState ===
      "BEARISH_ACCELERATION"

      &&

      volatility >= 4

    ) {

      return "PANIC_SELLING";
    }

    /*
    ==================================================
    MOMENTUM EXPLOSION
    ==================================================
    */

    if (

      momentumStrength >= 80

      &&

      volatility >= 3

    ) {

      return "MOMENTUM_EXPLOSION";
    }

    /*
    ==================================================
    ACCUMULATION
    ==================================================
    */

    if (

      regime === "SIDEWAYS"

      &&

      volatility < 2

      &&

      alignmentScore >= 60

    ) {

      return "ACCUMULATION";
    }

    /*
    ==================================================
    DEFAULT
    ==================================================
    */

    return "NEUTRAL";

  } catch (err) {

    console.log(

      "Market state classifier error:",

      err.message
    );

    return "UNKNOWN";
  }
}

module.exports = {
  classifyMarketState,
};
