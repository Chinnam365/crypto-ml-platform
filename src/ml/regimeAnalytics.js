const pool =
  require("../db/db");

/*
==================================================
AUTONOMOUS MARKET BEHAVIOR PROFILING
==================================================
*/

async function analyzeMarketBehavior() {

  try {

    /*
    ==================================================
    LOAD RECENT MARKET MEMORY
    ==================================================
    */

    const result =
      await pool.query(

        `
        SELECT *

        FROM signal_memory

        ORDER BY id DESC

        LIMIT 3000
        `
      );

    const signals =
      result.rows;

    /*
    ==================================================
    DEFAULT PROFILE
    ==================================================
    */

    const profile = {

      trendingBehavior: 0,

      sidewaysBehavior: 0,

      volatileBehavior: 0,

      breakoutBehavior: 0,

      fakeoutBehavior: 0,

      momentumPersistence: 0,

      reversalBehavior: 0,

      emotionalVolatility: 0,
    };

    /*
    ==================================================
    EMPTY DATA
    ==================================================
    */

    if (
      signals.length < 30
    ) {

      return {

        profile,

        dominantBehavior:
          "UNKNOWN",

        behaviorScore: 50,
      };
    }

    /*
    ==================================================
    ANALYSIS COUNTERS
    ==================================================
    */

    let trendingCount = 0;

    let sidewaysCount = 0;

    let volatileCount = 0;

    let breakoutCount = 0;

    let fakeoutCount = 0;

    let momentumCount = 0;

    let reversalCount = 0;

    let emotionalCount = 0;

    /*
    ==================================================
    PROCESS SIGNALS
    ==================================================
    */

    for (
      const signal of signals
    ) {

      /*
      ================================================
      TRENDING
      ================================================
      */

      if (
        signal.regime ===
        "TRENDING"
      ) {

        trendingCount++;
      }

      /*
      ================================================
      SIDEWAYS
      ================================================
      */

      if (
        signal.regime ===
        "SIDEWAYS"
      ) {

        sidewaysCount++;
      }

      /*
      ================================================
      VOLATILE
      ================================================
      */

      if (
        signal.volatility_regime ===
        "HIGH"
      ) {

        volatileCount++;
      }

      /*
      ================================================
      BREAKOUT BEHAVIOR
      ================================================
      */

      if (

        signal.momentum_state ===
        "BULLISH_ACCELERATION"

        ||

        signal.momentum_state ===
        "BEARISH_ACCELERATION"
      ) {

        breakoutCount++;
      }

      /*
      ================================================
      FAKEOUT BEHAVIOR
      ================================================
      */

      if (

        signal.regime ===
        "SIDEWAYS"

        &&

        (
          signal.momentum_state ===
          "BULLISH_ACCELERATION"

          ||

          signal.momentum_state ===
          "BEARISH_ACCELERATION"
        )
      ) {

        fakeoutCount++;
      }

      /*
      ================================================
      MOMENTUM PERSISTENCE
      ================================================
      */

      if (

        signal.alignment_score >= 80

        &&

        signal.regime ===
        "TRENDING"
      ) {

        momentumCount++;
      }

      /*
      ================================================
      REVERSAL BEHAVIOR
      ================================================
      */

      if (

        signal.rsi >= 75

        ||

        signal.rsi <= 25
      ) {

        reversalCount++;
      }

      /*
      ================================================
      EMOTIONAL VOLATILITY
      ================================================
      */

      if (

        signal.volatility_regime ===
        "HIGH"

        &&

        signal.alignment_score < 50
      ) {

        emotionalCount++;
      }
    }

    /*
    ==================================================
    BUILD PROFILE
    ==================================================
    */

    const total =
      signals.length;

    profile.trendingBehavior =

      Number(
        (
          (trendingCount / total)
          * 100
        ).toFixed(2)
      );

    profile.sidewaysBehavior =

      Number(
        (
          (sidewaysCount / total)
          * 100
        ).toFixed(2)
      );

    profile.volatileBehavior =

      Number(
        (
          (volatileCount / total)
          * 100
        ).toFixed(2)
      );

    profile.breakoutBehavior =

      Number(
        (
          (breakoutCount / total)
          * 100
        ).toFixed(2)
      );

    profile.fakeoutBehavior =

      Number(
        (
          (fakeoutCount / total)
          * 100
        ).toFixed(2)
      );

    profile.momentumPersistence =

      Number(
        (
          (momentumCount / total)
          * 100
        ).toFixed(2)
      );

    profile.reversalBehavior =

      Number(
        (
          (reversalCount / total)
          * 100
        ).toFixed(2)
      );

    profile.emotionalVolatility =

      Number(
        (
          (emotionalCount / total)
          * 100
        ).toFixed(2)
      );

    /*
    ==================================================
    DOMINANT MARKET BEHAVIOR
    ==================================================
    */

    let dominantBehavior =
      "BALANCED";

    let highestScore = 0;

    for (
      const key of
      Object.keys(profile)
    ) {

      if (
        profile[key] >
        highestScore
      ) {

        highestScore =
          profile[key];

        dominantBehavior =
          key;
      }
    }

    /*
    ==================================================
    MARKET STABILITY SCORE
    ==================================================
    */

    let behaviorScore =

      100 -

      (
        profile.emotionalVolatility
        * 0.7
      )

      -

      (
        profile.fakeoutBehavior
        * 0.5
      );

    behaviorScore =

      Math.max(
        1,
        Math.min(
          behaviorScore,
          100
        )
      );

    behaviorScore =
      Number(
        behaviorScore.toFixed(2)
      );

    /*
    ==================================================
    LOGGING
    ==================================================
    */

    console.log(`
==================================
MARKET BEHAVIOR PROFILING
==================================

Dominant Behavior:
${dominantBehavior}

Behavior Stability Score:
${behaviorScore}

Trending:
${profile.trendingBehavior}%

Sideways:
${profile.sidewaysBehavior}%

Volatile:
${profile.volatileBehavior}%

Breakout:
${profile.breakoutBehavior}%

Fakeout:
${profile.fakeoutBehavior}%

Momentum Persistence:
${profile.momentumPersistence}%

Reversal:
${profile.reversalBehavior}%

Emotional Volatility:
${profile.emotionalVolatility}%

==================================
`);

    /*
    ==================================================
    RETURN
    ==================================================
    */

    return {

      profile,

      dominantBehavior,

      behaviorScore,
    };

  } catch (err) {

    console.log(`
==================================
MARKET BEHAVIOR ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

    return {

      profile: {},

      dominantBehavior:
        "UNKNOWN",

      behaviorScore: 50,
    };
  }
}

module.exports = {
  analyzeMarketBehavior,
};
