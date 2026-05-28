const pool =
  require("../db/db");

/*
==================================================
META CONFIDENCE CALIBRATION
==================================================
*/

async function calibrateConfidence({

  mlProbability = 50,

  probabilisticScore = 50,

  adaptiveConfidence = 50,

  memoryBoost = 0,

  regime = "SIDEWAYS",

  volatilityRegime = "NORMAL",

  trend = "SIDEWAYS",
}) {

  try {

    /*
    ==================================================
    LOAD RECENT PERFORMANCE
    ==================================================
    */

    const result =
      await pool.query(

        `
        SELECT *

        FROM trade_history

        WHERE

          outcome IS NOT NULL

          AND

          outcome != 'PENDING'

        ORDER BY id DESC

        LIMIT 300
        `
      );

    const trades =
      result.rows;

    /*
    ==================================================
    DEFAULT WEIGHTS
    ==================================================
    */

    let mlWeight = 0.35;

    let probabilisticWeight = 0.25;

    let adaptiveWeight = 0.30;

    let memoryWeight = 0.10;

    /*
    ==================================================
    MARKET REGIME ADAPTATION
    ==================================================
    */

    /*
    Trending markets trust momentum and ML
    */

    if (
      regime === "TRENDING"
    ) {

      mlWeight = 0.40;

      probabilisticWeight = 0.20;

      adaptiveWeight = 0.30;

      memoryWeight = 0.10;
    }

    /*
    Sideways markets trust memory and probabilities
    */

    else if (
      regime === "SIDEWAYS"
    ) {

      mlWeight = 0.25;

      probabilisticWeight = 0.35;

      adaptiveWeight = 0.25;

      memoryWeight = 0.15;
    }

    /*
    Volatile markets become defensive
    */

    if (
      volatilityRegime === "HIGH"
    ) {

      adaptiveWeight += 0.10;

      mlWeight -= 0.05;
    }

    /*
    ==================================================
    TREND CONFIDENCE BOOST
    ==================================================
    */

    if (

      trend === "BULLISH"

      ||

      trend === "BEARISH"
    ) {

      mlWeight += 0.05;
    }

    /*
    ==================================================
    NORMALIZATION
    ==================================================
    */

    const totalWeight =

      mlWeight +

      probabilisticWeight +

      adaptiveWeight +

      memoryWeight;

    mlWeight /=
      totalWeight;

    probabilisticWeight /=
      totalWeight;

    adaptiveWeight /=
      totalWeight;

    memoryWeight /=
      totalWeight;

    /*
    ==================================================
    CALIBRATED CONFIDENCE
    ==================================================
    */

    let calibratedConfidence =

      (
        mlProbability
        * mlWeight
      )

      +

      (
        probabilisticScore
        * probabilisticWeight
      )

      +

      (
        adaptiveConfidence
        * adaptiveWeight
      )

      +

      (
        memoryBoost
        * memoryWeight
      );

    /*
    ==================================================
    PERFORMANCE CALIBRATION
    ==================================================
    */

    if (
      trades.length >= 30
    ) {

      let wins = 0;

      for (
        const trade of trades
      ) {

        if (
          trade.outcome === "WIN"
        ) {

          wins++;
        }
      }

      const winRate =

        (
          wins /
          trades.length
        ) * 100;

      /*
      Strong system
      */

      if (
        winRate >= 60
      ) {

        calibratedConfidence += 5;
      }

      /*
      Weak system
      */

      else if (
        winRate <= 40
      ) {

        calibratedConfidence -= 5;
      }
    }

    /*
    ==================================================
    CLAMPING
    ==================================================
    */

    calibratedConfidence =

      Math.max(
        1,
        Math.min(
          calibratedConfidence,
          99
        )
      );

    calibratedConfidence =
      Number(
        calibratedConfidence.toFixed(2)
      );

    /*
    ==================================================
    LOGGING
    ==================================================
    */

    console.log(`
==================================
META CONFIDENCE CALIBRATION
==================================

ML Weight:
${mlWeight.toFixed(2)}

Probabilistic Weight:
${probabilisticWeight.toFixed(2)}

Adaptive Weight:
${adaptiveWeight.toFixed(2)}

Memory Weight:
${memoryWeight.toFixed(2)}

Calibrated Confidence:
${calibratedConfidence}

Regime:
${regime}

Volatility:
${volatilityRegime}

Trend:
${trend}

==================================
`);

    return {

      calibratedConfidence,

      weights: {

        mlWeight:
          Number(
            mlWeight.toFixed(2)
          ),

        probabilisticWeight:
          Number(
            probabilisticWeight.toFixed(2)
          ),

        adaptiveWeight:
          Number(
            adaptiveWeight.toFixed(2)
          ),

        memoryWeight:
          Number(
            memoryWeight.toFixed(2)
          ),
      },
    };

  } catch (err) {

    console.log(`
==================================
CONFIDENCE CALIBRATION ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

    return {

      calibratedConfidence: 50,

      weights: {},
    };
  }
}

module.exports = {
  calibrateConfidence,
};
