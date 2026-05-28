const pool =
  require("../db/db");

/*
==================================================
TEMPORAL REGIME MEMORY
==================================================
*/

async function updateRegimeMemory({

  currentState,

  predictedState,

  transitionProbability,

  trend,

  volatilityRegime,

  momentumState,
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
          existing.occurrences
        ) + 1;

      const avgProbability =

        (
          (
            Number(
              existing.avg_probability
            )

            *

            Number(
              existing.occurrences
            )
          )

          +

          transitionProbability
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
    };
  }
}

/*
==================================================
LOAD TEMPORAL MARKET MEMORY
==================================================
*/

async function getRegimeMemory({

  currentState,

  trend,

  volatilityRegime,

  momentumState,
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
    NO MEMORY
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
            memory.avg_probability
          ),

        occurrences:
          Number(
            memory.occurrences
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

    console.table(predictions);

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
    };
  }
}

module.exports = {

  updateRegimeMemory,

  getRegimeMemory,
};
