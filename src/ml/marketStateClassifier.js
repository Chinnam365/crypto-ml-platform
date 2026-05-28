/*
==================================================
AUTONOMOUS MARKET SENTIMENT INTELLIGENCE
==================================================
*/

function classifyMarketState({

  rsi = 50,

  volatility = 1,

  macd = 0,

  trend = "SIDEWAYS",

  momentumState = "NEUTRAL",

  volumeRatio = 1,

  confidence = 50,

  consensusStrength = 50,

  alignmentScore = 50,
}) {

  try {

    /*
    ==================================================
    MARKET STATE
    ==================================================
    */

    let currentState =
      "NEUTRAL";

    /*
    ==================================================
    SENTIMENT PROFILE
    ==================================================
    */

    let sentiment =
      "NEUTRAL";

    let emotionalPressure = 0;

    /*
    ==================================================
    CURRENT MARKET STATE
    ==================================================
    */

    /*
    ----------------------------------------------
    TRENDING
    ----------------------------------------------
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
    ----------------------------------------------
    SIDEWAYS
    ----------------------------------------------
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
    ----------------------------------------------
    VOLATILE
    ----------------------------------------------
    */

    if (
      volatility >= 3
    ) {

      currentState =
        "VOLATILE";
    }

    /*
    ----------------------------------------------
    LOW ACTIVITY
    ----------------------------------------------
    */

    if (
      volatility < 0.8
    ) {

      currentState =
        "LOW_ACTIVITY";
    }

    /*
    ==================================================
    EMOTIONAL MARKET ANALYSIS
    ==================================================
    */

    /*
    ----------------------------------------------
    FEAR
    ----------------------------------------------
    */

    if (

      rsi < 30

      &&

      volatility >= 2
    ) {

      sentiment =
        "FEAR";

      emotionalPressure += 35;
    }

    /*
    ----------------------------------------------
    GREED
    ----------------------------------------------
    */

    if (

      rsi > 70

      &&

      trend === "BULLISH"
    ) {

      sentiment =
        "GREED";

      emotionalPressure += 30;
    }

    /*
    ----------------------------------------------
    PANIC
    ----------------------------------------------
    */

    if (

      volatility >= 4

      &&

      consensusStrength <= 35
    ) {

      sentiment =
        "PANIC";

      emotionalPressure += 45;
    }

    /*
    ----------------------------------------------
    EUPHORIA
    ----------------------------------------------
    */

    if (

      volumeRatio >= 2

      &&

      momentumState ===
      "BULLISH_ACCELERATION"
    ) {

      sentiment =
        "EUPHORIA";

      emotionalPressure += 40;
    }

    /*
    ----------------------------------------------
    EXHAUSTION
    ----------------------------------------------
    */

    if (

      Math.abs(macd) < 0.05

      &&

      confidence <= 45
    ) {

      sentiment =
        "EXHAUSTION";

      emotionalPressure += 20;
    }

    /*
    ----------------------------------------------
    CONVICTION
    ----------------------------------------------
    */

    if (

      consensusStrength >= 75

      &&

      alignmentScore >= 75
    ) {

      sentiment =
        "CONVICTION";

      emotionalPressure += 10;
    }

    /*
    ==================================================
    PREDICTIVE MARKET STATE
    ==================================================
    */

    let predictedState =
      currentState;

    /*
    Fear reversal
    */

    if (
      sentiment === "FEAR"
    ) {

      predictedState =
        "REVERSAL_RISK";
    }

    /*
    Panic instability
    */

    if (
      sentiment === "PANIC"
    ) {

      predictedState =
        "VOLATILE";
    }

    /*
    Euphoric continuation
    */

    if (
      sentiment === "EUPHORIA"
    ) {

      predictedState =
        "TRENDING";
    }

    /*
    Exhaustion collapse
    */

    if (
      sentiment === "EXHAUSTION"
    ) {

      predictedState =
        "SIDEWAYS";
    }

    /*
    Conviction continuation
    */

    if (
      sentiment === "CONVICTION"
    ) {

      predictedState =
        "TRENDING";
    }

    /*
    ==================================================
    EMOTIONAL STABILITY
    ==================================================
    */

    let emotionalStability =

      100 -
      emotionalPressure;

    emotionalStability =

      Math.max(
        1,
        Math.min(
          emotionalStability,
          100
        )
      );

    emotionalStability =
      Number(
        emotionalStability.toFixed(2)
      );

    /*
    ==================================================
    CLAMP PRESSURE
    ==================================================
    */

    emotionalPressure =

      Math.max(
        0,
        Math.min(
          emotionalPressure,
          100
        )
      );

    emotionalPressure =
      Number(
        emotionalPressure.toFixed(2)
      );

    /*
    ==================================================
    TRANSITION PROBABILITY
    ==================================================
    */

    let transitionProbability =

      emotionalPressure * 0.8;

    transitionProbability =

      Math.max(
        0,
        Math.min(
          transitionProbability,
          95
        )
      );

    transitionProbability =
      Number(
        transitionProbability.toFixed(2)
      );

    /*
    ==================================================
    FORECAST CONFIDENCE
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
MARKET SENTIMENT INTELLIGENCE
==================================

Current State:
${currentState}

Predicted State:
${predictedState}

Sentiment:
${sentiment}

Emotional Pressure:
${emotionalPressure}

Emotional Stability:
${emotionalStability}

Transition Probability:
${transitionProbability}

Forecast Confidence:
${forecastConfidence}

RSI:
${rsi}

MACD:
${macd}

Trend:
${trend}

Volatility:
${volatility}

Consensus Strength:
${consensusStrength}

Alignment Score:
${alignmentScore}

Volume Ratio:
${volumeRatio}

Momentum:
${momentumState}

==================================
`);

    /*
    ==================================================
    RETURN
    ==================================================
    */

    return {

      currentState,

      predictedState,

      sentiment,

      emotionalPressure,

      emotionalStability,

      transitionProbability,

      forecastConfidence,
    };

  } catch (err) {

    console.log(`
==================================
MARKET SENTIMENT ERROR
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

      sentiment:
        "NEUTRAL",

      emotionalPressure: 0,

      emotionalStability: 50,

      transitionProbability: 0,

      forecastConfidence: 50,
    };
  }
}

module.exports = {
  classifyMarketState,
};
