/*
==================================================
PREDICTIVE MARKET STATE ENGINE
==================================================
*/

function classifyMarketState({

  rsi,

  volatility,

  macd,

  trend,

  momentumState,

  volumeRatio = 1,
}) {

  try {

    /*
    ==================================================
    DEFAULT
    ==================================================
    */

    let currentState =
      "NEUTRAL";

    let predictedState =
      "NEUTRAL";

    let transitionProbability =
      0;

    /*
    ==================================================
    CURRENT MARKET STATE
    ==================================================
    */

    /*
    Trending
    */

    if (

      (
        trend === "BULLISH"

        ||

        trend === "BEARISH"
      )

      &&

      volatility > 1.5
    ) {

      currentState =
        "TRENDING";
    }

    /*
    Sideways
    */

    else if (

      trend === "SIDEWAYS"

      &&

      volatility < 1.5
    ) {

      currentState =
        "SIDEWAYS";
    }

    /*
    Volatile
    */

    if (
      volatility >= 3
    ) {

      currentState =
        "VOLATILE";
    }

    /*
    Low activity
    */

    if (
      volatility < 0.8
    ) {

      currentState =
        "LOW_ACTIVITY";
    }

    /*
    ==================================================
    PREDICTIVE TRANSITION LOGIC
    ==================================================
    */

    /*
    Breakout Forecast
    */

    if (

      currentState ===
      "SIDEWAYS"

      &&

      Math.abs(macd) > 0.4

      &&

      volumeRatio > 1.5
    ) {

      predictedState =
        "TRENDING";

      transitionProbability = 70;
    }

    /*
    Volatility Expansion
    */

    if (

      volatility > 2.2

      &&

      volumeRatio > 1.8
    ) {

      predictedState =
        "VOLATILE";

      transitionProbability = 80;
    }

    /*
    Momentum Acceleration
    */

    if (

      momentumState ===
      "BULLISH_ACCELERATION"

      ||

      momentumState ===
      "BEARISH_ACCELERATION"
    ) {

      predictedState =
        "TRENDING";

      transitionProbability += 15;
    }

    /*
    Momentum Exhaustion
    */

    if (

      rsi > 80

      ||

      rsi < 20
    ) {

      predictedState =
        "REVERSAL_RISK";

      transitionProbability += 20;
    }

    /*
    Trend Exhaustion
    */

    if (

      currentState ===
      "TRENDING"

      &&

      Math.abs(macd) < 0.1

      &&

      volatility declining
    ) {

      predictedState =
        "SIDEWAYS";

      transitionProbability += 15;
    }

    /*
    ==================================================
    CLAMPING
    ==================================================
    */

    transitionProbability =

      Math.max(
        0,
        Math.min(
          transitionProbability,
          95
        )
      );

    /*
    ==================================================
    CONFIDENCE
    ==================================================
    */

    let forecastConfidence =
      50;

    if (
      transitionProbability >= 80
    ) {

      forecastConfidence = 90;
    }

    else if (
      transitionProbability >= 60
    ) {

      forecastConfidence = 75;
    }

    else if (
      transitionProbability >= 40
    ) {

      forecastConfidence = 60;
    }

    /*
    ==================================================
    LOGGING
    ==================================================
    */

    console.log(`
==================================
PREDICTIVE MARKET STATE
==================================

Current State:
${currentState}

Predicted State:
${predictedState}

Transition Probability:
${transitionProbability}%

Forecast Confidence:
${forecastConfidence}

Trend:
${trend}

RSI:
${rsi}

MACD:
${macd}

Volatility:
${volatility}

Momentum:
${momentumState}

==================================
`);

    return {

      currentState,

      predictedState,

      transitionProbability,

      forecastConfidence,
    };

  } catch (err) {

    console.log(`
==================================
MARKET STATE ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

    return {

      currentState:
        "NEUTRAL",

      predictedState:
        "NEUTRAL",

      transitionProbability: 0,

      forecastConfidence: 50,
    };
  }
}

module.exports = {
  classifyMarketState,
};
