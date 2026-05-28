const pool =
  require("../db/db");

/*
==================================================
UPDATE REGIME MEMORY
==================================================
*/

async function updateRegimeMemory({

  currentState = "NEUTRAL",

  predictedState = "NEUTRAL",

  transitionProbability = 0,

  trend = "SIDEWAYS",

  volatilityRegime = "NORMAL",

  momentumState = "NEUTRAL",
}) {

  try {

    /*
    ==================================================
    CONTEXT KEY
    ==================================================
    */

    const contextKey =

      `${currentState}_` +

      `${predictedState}_` +

      `${trend}_` +

      `${volatilityRegime}_` +

      `${momentumState}`;

    /*
    ==================================================
    CHECK EXISTING MEMORY
    ==================================================
    */

    const existingResult =
      await pool.query(

        `
        SELECT *

        FROM regime_memory

        WHERE context_key = $1

        LIMIT 1
        `,

        [contextKey]
      );

    /*
    ==================================================
    INSERT NEW MEMORY
    ==================================================
    */

    if (
      existingResult.rows.length === 0
    ) {

      await pool.query(

        `
        INSERT INTO regime_memory (

          context_key,

          current_state,

          predicted_state,

          trend,

          volatility_regime,

          momentum_state,

          transition_probability,

          occurrences,

          avg_probability,

          created_at,

          updated_at

        )

        VALUES (

          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          1,
          $7,
          NOW(),
          NOW()
        )
        `,

        [

          contextKey,

          currentState,

          predictedState,

          trend,

          volatilityRegime,

          momentumState,

          transitionProbability,
        ]
      );
    }

    /*
    ==================================================
    UPDATE EXISTING MEMORY
    ==================================================
    */

    else {

      const existing =
        existingResult.rows[0];

      const occurrences =

        Number(
          existing.occurrences || 0
        ) + 1;

      const avgProbability =

        (
          (
            Number(
              existing.avg_probability || 0
            )

            *

            Number(
              existing.occurrences || 0
            )
          )

          +

          Number(
            transitionProbability || 0
          )

        )

        /

        occurrences;

      await pool.query(

        `
        UPDATE regime_memory

        SET

          occurrences = $1,

          avg_probability = $2,

          updated_at = NOW()

        WHERE context_key = $3
        `,

        [

          occurrences,

          Number(
            avgProbability.toFixed(2)
          ),

          contextKey,
        ]
      );
    }

    /*
    ==================================================
    LOGGING
    ==================================================
    */

    console.log(`
==================================
REGIME MEMORY UPDATED
==================================

Current State:
${currentState}

Predicted State:
${predictedState}

Trend:
${trend}

Volatility:
${volatilityRegime}

Momentum:
${momentumState}

Transition Probability:
${transitionProbability}

==================================
`);

    return {

      success: true,

      contextKey,
    };

  } catch (err) {

    console.log(`
==================================
REGIME MEMORY ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

    return {

      success: false,

      error: err.message,
    };
  }
}

/*
==================================================
GET REGIME MEMORY
==================================================
*/

async function getRegimeMemory({

  currentState = "NEUTRAL",

  trend = "SIDEWAYS",

  volatilityRegime = "NORMAL",

  momentumState = "NEUTRAL",
}) {

  try {

    const result =
      await pool.query(

        `
        SELECT *

        FROM regime_memory

        WHERE

          current_state = $1

          AND

          trend = $2

          AND

          volatility_regime = $3

          AND

          momentum_state = $4

        ORDER BY occurrences DESC

        LIMIT 5
        `,

        [

          currentState,

          trend,

          volatilityRegime,

          momentumState,
        ]
      );

    const memories =
      result.rows;

    /*
    ==================================================
    NO MEMORY FOUND
    ==================================================
    */

    if (
      memories.length === 0
    ) {

      return {

        found: false,

        predictions: [],
      };
    }

    /*
    ==================================================
    BUILD PREDICTIONS
    ==================================================
    */

    const predictions =

      memories.map(memory => ({

        predictedState:
          memory.predicted_state,

        avgProbability:
          Number(
            memory.avg_probability || 0
          ),

        occurrences:
          Number(
            memory.occurrences || 0
          ),
      }));

    /*
    ==================================================
    LOGGING
    ==================================================
    */

    console.log(`
==================================
TEMPORAL REGIME MEMORY
==================================
`);

    console.table(
      predictions
    );

    console.log(`
==================================
`);

    return {

      found: true,

      predictions,
    };

  } catch (err) {

    console.log(`
==================================
REGIME MEMORY LOAD ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

    return {

      found: false,

      predictions: [],

      error: err.message,
    };
  }
}

module.exports = {

  updateRegimeMemory,

  getRegimeMemory,
};
