const pool =
  require("../db/db");

/*
==================================================
ADAPTIVE CONFIDENCE ENGINE
==================================================
*/

async function calculateAdaptiveConfidence({

  baseConfidence = 50,

  trend,

  regime,

  volatilityRegime,

  momentumState,

  overallTrend,
}) {

  try {

    /*
    ==================================================
    CONTEXT KEY
    ==================================================
    */

    const contextKey =

      `${trend}_` +

      `${regime}_` +

      `${volatilityRegime}_` +

      `${momentumState}_` +

      `${overallTrend}`;

    /*
    ==================================================
    LOAD REINFORCEMENT CONTEXT
    ==================================================
    */

    const result =
      await pool.query(

        `
        SELECT *

        FROM reinforcement_memory

        WHERE context_key = $1

        LIMIT 1
        `,

        [contextKey]
      );

    /*
    ==================================================
    NO MEMORY YET
    ==================================================
    */

    if (
      result.rows.length === 0
    ) {

      return {

        adjustedConfidence:
          baseConfidence,

        reinforcementBoost: 0,

        sampleSize: 0,
      };
    }

    const memory =
      result.rows[0];

    const avgReward =
      Number(
        memory.avg_reward || 0
      );

    const sampleSize =
      Number(
        memory.sample_size || 0
      );

    /*
    ==================================================
    REINFORCEMENT BOOST
    ==================================================
    */

    let reinforcementBoost =

      avgReward * 12;

    /*
    ==================================================
    SAMPLE CONFIDENCE WEIGHTING
    ==================================================
    */

    if (
      sampleSize < 5
    ) {

      reinforcementBoost *= 0.3;
    }

    else if (
      sampleSize < 15
    ) {

      reinforcementBoost *= 0.6;
    }

    else if (
      sampleSize < 30
    ) {

      reinforcementBoost *= 0.8;
    }

    /*
    ==================================================
    FINAL CONFIDENCE
    ==================================================
    */

    let adjustedConfidence =

      baseConfidence +
      reinforcementBoost;

    /*
    ==================================================
    CLAMPING
    ==================================================
    */

    adjustedConfidence =

      Math.max(
        1,
        Math.min(
          adjustedConfidence,
          99
        )
      );

    adjustedConfidence =
      Number(
        adjustedConfidence.toFixed(2)
      );

    console.log(`
==================================
ADAPTIVE CONFIDENCE
==================================

Base Confidence:
${baseConfidence}

Avg Reward:
${avgReward}

Reinforcement Boost:
${reinforcementBoost.toFixed(2)}

Adjusted Confidence:
${adjustedConfidence}

Sample Size:
${sampleSize}

==================================
`);

    return {

      adjustedConfidence,

      reinforcementBoost:
        Number(
          reinforcementBoost.toFixed(2)
        ),

      sampleSize,
    };

  } catch (err) {

    console.log(`
==================================
ADAPTIVE CONFIDENCE ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

    return {

      adjustedConfidence:
        baseConfidence,

      reinforcementBoost: 0,

      sampleSize: 0,
    };
  }
}

module.exports = {
  calculateAdaptiveConfidence,
};
