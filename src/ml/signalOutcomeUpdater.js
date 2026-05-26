const pool =
  require("../db/db");

/*
==================================================
SIGNAL OUTCOME LABELER
==================================================
*/

async function updateSignalOutcomes() {

  try {

    /*
    ==================================================
    LOAD UNCHECKED SIGNALS
    ==================================================
    */

    const signalsResult =
      await pool.query(

        `
        SELECT *

        FROM signal_memory

        WHERE outcome_checked = FALSE

        ORDER BY id ASC

        LIMIT 100
        `
      );

    const signals =
      signalsResult.rows;

    if (
      signals.length === 0
    ) {

      return;
    }

    for (
      const signal of signals
    ) {

      /*
      ================================================
      WAIT MINIMUM TIME
      ================================================
      */

      const signalTime =
        new Date(
          signal.created_at
        );

      const now =
        new Date();

      const minutesPassed =

        (
          now - signalTime
        ) / 1000 / 60;

      /*
      Wait 30 minutes
      */

      if (
        minutesPassed < 30
      ) {

        continue;
      }

      /*
      ================================================
      CURRENT MARKET PRICE
      ================================================
      */

      const marketResult =
        await pool.query(

          `
          SELECT close

          FROM market_candles

          WHERE symbol = $1

          ORDER BY candle_time DESC

          LIMIT 1
          `,

          [signal.symbol]
        );

      if (
        marketResult.rows.length === 0
      ) {

        continue;
      }

      const futurePrice =
        Number(
          marketResult.rows[0].close
        );

      /*
      ================================================
      ORIGINAL SIGNAL PRICE
      ================================================
      */

      const signalPrice =
        Number(
          signal.signal_price || 0
        );

      /*
      ================================================
      FUTURE CHANGE %
      ================================================
      */

      let futureChangePercent =
        0;

      if (
        signalPrice !== 0
      ) {

        futureChangePercent =

          (
            (
              futurePrice -
              signalPrice
            ) / signalPrice
          ) * 100;
      }

      /*
      ================================================
      DETERMINE OUTCOME
      ================================================
      */

      let signalOutcome =
        "NEUTRAL";

      /*
      BUY SUCCESS
      */

      if (

        signal.decision === "BUY"

        &&

        futureChangePercent > 1

      ) {

        signalOutcome =
          "SUCCESS";
      }

      /*
      BUY FAILURE
      */

      else if (

        signal.decision === "BUY"

        &&

        futureChangePercent < -1

      ) {

        signalOutcome =
          "FAILURE";
      }

      /*
      SELL SUCCESS
      */

      else if (

        signal.decision === "SELL"

        &&

        futureChangePercent < -1

      ) {

        signalOutcome =
          "SUCCESS";
      }

      /*
      SELL FAILURE
      */

      else if (

        signal.decision === "SELL"

        &&

        futureChangePercent > 1

      ) {

        signalOutcome =
          "FAILURE";
      }

      /*
      HOLD CORRECT
      */

      else if (

        signal.decision === "HOLD"

        &&

        Math.abs(
          futureChangePercent
        ) < 1

      ) {

        signalOutcome =
          "SUCCESS";
      }

      /*
      HOLD FAILURE
      */

      else if (

        signal.decision === "HOLD"

        &&

        Math.abs(
          futureChangePercent
        ) >= 1

      ) {

        signalOutcome =
          "FAILURE";
      }

      /*
      ================================================
      UPDATE SIGNAL
      ================================================
      */

      await pool.query(

        `
        UPDATE signal_memory

        SET

          future_price = $1,

          future_change_percent = $2,

          signal_outcome = $3,

          outcome_checked = TRUE

        WHERE id = $4
        `,

        [

          futurePrice,

          Number(
            futureChangePercent.toFixed(2)
          ),

          signalOutcome,

          signal.id,
        ]
      );
    }

  } catch (err) {

    console.log(

      "Signal outcome updater error:",

      err.message
    );
  }
}

module.exports = {
  updateSignalOutcomes,
};
