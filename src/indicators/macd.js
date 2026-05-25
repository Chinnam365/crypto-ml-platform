/*
==================================================
EMA HELPER
==================================================
*/

function calculateEMA(
  prices,
  period
) {

  if (
    !prices ||
    prices.length === 0
  ) {
    return 0;
  }

  const multiplier =
    2 / (period + 1);

  let ema =
    prices[0];

  for (
    let i = 1;
    i < prices.length;
    i++
  ) {

    ema =
      ((prices[i] - ema) * multiplier)
      + ema;
  }

  return ema;
}

/*
==================================================
MACD ENGINE
==================================================
*/

function calculateMACD(
  closes = []
) {

  try {

    if (
      closes.length < 35
    ) {

      return {

        macd: 0,

        signalLine: 0,

        histogram: 0,

        momentumState:
          "NEUTRAL",

        momentumStrength: 0,
      };
    }

    /*
    ==================================================
    FAST EMA 12
    ==================================================
    */

    const ema12 =
      calculateEMA(
        closes.slice(-12),
        12
      );

    /*
    ==================================================
    SLOW EMA 26
    ==================================================
    */

    const ema26 =
      calculateEMA(
        closes.slice(-26),
        26
      );

    /*
    ==================================================
    MACD LINE
    ==================================================
    */

    const macd =
      ema12 - ema26;

    /*
    ==================================================
    BUILD MACD HISTORY
    ==================================================
    */

    const macdHistory = [];

    for (
      let i = 26;
      i < closes.length;
      i++
    ) {

      const fast =
        calculateEMA(
          closes.slice(i - 12, i),
          12
        );

      const slow =
        calculateEMA(
          closes.slice(i - 26, i),
          26
        );

      macdHistory.push(
        fast - slow
      );
    }

    /*
    ==================================================
    SIGNAL LINE
    ==================================================
    */

    const signalLine =
      calculateEMA(
        macdHistory.slice(-9),
        9
      );

    /*
    ==================================================
    HISTOGRAM
    ==================================================
    */

    const histogram =
      macd - signalLine;

    /*
    ==================================================
    MOMENTUM STATE
    ==================================================
    */

    let momentumState =
      "NEUTRAL";

    if (
      histogram > 0 &&
      macd > signalLine
    ) {

      momentumState =
        "BULLISH_ACCELERATION";
    }

    else if (
      histogram > 0 &&
      macd < signalLine
    ) {

      momentumState =
        "BULLISH_WEAKENING";
    }

    else if (
      histogram < 0 &&
      macd < signalLine
    ) {

      momentumState =
        "BEARISH_ACCELERATION";
    }

    else if (
      histogram < 0 &&
      macd > signalLine
    ) {

      momentumState =
        "BEARISH_WEAKENING";
    }

    /*
    ==================================================
    MOMENTUM STRENGTH
    ==================================================
    */

    let momentumStrength =
      Math.abs(histogram) * 100;

    if (
      momentumStrength > 100
    ) {

      momentumStrength = 100;
    }

    return {

      macd:
        Number(
          macd.toFixed(6)
        ),

      signalLine:
        Number(
          signalLine.toFixed(6)
        ),

      histogram:
        Number(
          histogram.toFixed(6)
        ),

      momentumState,

      momentumStrength:
        Number(
          momentumStrength.toFixed(2)
        ),
    };

  } catch (err) {

    console.log(
      "MACD Error:",
      err.message
    );

    return {

      macd: 0,

      signalLine: 0,

      histogram: 0,

      momentumState:
        "NEUTRAL",

      momentumStrength: 0,
    };
  }
}

module.exports = {
  calculateMACD,
};
