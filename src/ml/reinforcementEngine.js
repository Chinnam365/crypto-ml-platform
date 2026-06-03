const pool =
  require("../db/db");

/*
==================================================
REINFORCEMENT LEARNING ENGINE
==================================================
*/

async function updateReinforcementMemory() {

  try {

    /*
    ==================================================
    LOAD CLOSED TRADES
    ==================================================
    */

    const result =
      await pool.query(

        `
        SELECT *
FROM positions
WHERE status = 'CLOSED'
ORDER BY id DESC
LIMIT 500
        `
      );

    const trades =
      result.rows;

    if (
      trades.length < 20
    ) {

      console.log(`
==================================
NOT ENOUGH REINFORCEMENT DATA
==================================
`);

      return;
    }

    /*
    ==================================================
    PROCESS TRADES
    ==================================================
    */

    for (
      const trade of trades
    ) {

      try {

        /*
        ================================================
        CONTEXT KEY
        ================================================
        */

        const contextKey =

  `${trade.symbol}_` +

  `${trade.trend}_` +

  `${trade.regime}_` +

  `${trade.volatility_regime}_` +

  `${trade.momentum_state}_` +

  `${trade.overall_trend}`;

        /*
        ================================================
        REWARD
        ================================================
        */

        let reward = 0;

        if (
          trade.outcome === "WIN"
        ) {

          reward = 1;
        }

        else if (
          trade.outcome === "LOSS"
        ) {

          reward = -1;
        }

        else {

          reward = 0;
        }

        /*
        ================================================
        CHECK EXISTING MEMORY
        ================================================
        */

        const existingResult =
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
        ================================================
        INSERT NEW CONTEXT
        ================================================
        */

        if (
          existingResult.rows.length === 0
        ) {

          await pool.query(

  `
  INSERT INTO reinforcement_memory
  (
    context_key,
    reward,
    avg_reward,
    sample_size,
    confidence,
    pnl,
    pattern
  )
  VALUES
  (
    $1,
    $2,
    $2,
    1,
    $3,
    $4,
    $5
  )
  `,
  [
    contextKey,
    reward,
    Number(trade.confidence || 0),
    Number(trade.pnl || 0),
    contextKey
  ]
);
        }

        /*
        ================================================
        UPDATE EXISTING CONTEXT
        ================================================
        */

        else {

          const existing =
            existingResult.rows[0];

          const newTotalReward =
  Number(
    existing.total_reward || 0
  ) + reward;

          const newSampleSize =

            Number(
              existing.sample_size
            ) + 1;

          const avgReward =

            newTotalReward /
            newSampleSize;

          await pool.query(

            `
            UPDATE reinforcement_memory

            SET

              total_reward = $1,

              sample_size = $2,

              avg_reward = $3

            WHERE context_key = $4
            `,

            [

              newTotalReward,

              newSampleSize,

              Number(
                avgReward.toFixed(4)
              ),

              contextKey,
            ]
          );
        }

      } catch (tradeErr) {

        console.log(`
==================================
REINFORCEMENT TRADE ERROR
==================================
`);

        console.log(tradeErr);

        console.log(`
==================================
`);
      }
    }

    console.log(`
==================================
REINFORCEMENT MEMORY UPDATED
==================================

Trades Processed:
${trades.length}

==================================
`);

  } catch (err) {

    console.log(`
==================================
REINFORCEMENT ENGINE ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);
  }
}

module.exports = {
  updateReinforcementMemory,
};
