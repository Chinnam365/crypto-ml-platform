const pool =
  require("../db/db");

/*
==================================================
AUTO TRADE OUTCOME UPDATER
==================================================
*/

async function updateTradeOutcomes() {

  try {

    /*
    ==================================================
    LOAD OPEN TRADES
    ==================================================
    */

    const tradesResult =
      await pool.query(

        `
        SELECT *
        FROM trade_history
        WHERE outcome = 'PENDING'
        ORDER BY id ASC
        LIMIT 200
        `
      );

    const trades =
      tradesResult.rows;

    if (
      trades.length === 0
    ) {

      console.log(`
==================================
NO OPEN TRADES
==================================
`);

      return;
    }

    /*
    ==================================================
    PROCESS EACH TRADE
    ==================================================
    */

    for (
      const trade of trades
    ) {

      try {

        /*
        ================================================
        SKIP HOLD TRADES
        ================================================
        */

        if (
          trade.decision === "HOLD"
        ) {

          await pool.query(

            `
            UPDATE trade_history
            SET

              pnl = 0,

              outcome = 'NEUTRAL',

              closed_at = NOW()

            WHERE id = $1
            `,

            [trade.id]
          );

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

            [trade.symbol]
          );

        if (
          marketResult.rows.length === 0
        ) {

          console.log(`
==================================
NO MARKET PRICE
==================================

Symbol:
${trade.symbol}

==================================
`);

          continue;
        }

        const currentPrice =
          Number(
            marketResult.rows[0].close
          );

        const entryPrice =
          Number(
            trade.entry_price
          );

        /*
        ================================================
        VALIDATION
        ================================================
        */

        if (

          !currentPrice ||

          !entryPrice ||

          isNaN(currentPrice) ||

          isNaN(entryPrice)
        ) {

          console.log(`
==================================
INVALID TRADE PRICES
==================================

Trade ID:
${trade.id}

Current Price:
${currentPrice}

Entry Price:
${entryPrice}

==================================
`);

          continue;
        }

        let pnl = 0;

        /*
        ================================================
        BUY
        ================================================
        */

        if (
          trade.decision === "BUY"
        ) {

          pnl =

            (
              (
                currentPrice -
                entryPrice
              )

              /

              entryPrice
            ) * 100;
        }

        /*
        ================================================
        SELL
        ================================================
        */

        else if (
          trade.decision === "SELL"
        ) {

          pnl =

            (
              (
                entryPrice -
                currentPrice
              )

              /

              entryPrice
            ) * 100;
        }

        pnl =
          Number(
            pnl.toFixed(2)
          );

        /*
        ================================================
        CLOSE CONDITIONS
        ================================================
        */

        let shouldClose =
          false;

        let outcome =
          "PENDING";

        /*
        ================================================
        TAKE PROFIT
        ================================================
        */

        if (
          pnl >= 0.4
        ) {

          shouldClose = true;

          outcome = "WIN";
        }

        /*
        ================================================
        STOP LOSS
        ================================================
        */

        else if (
          pnl <= -0.4
        ) {

          shouldClose = true;

          outcome = "LOSS";
        }

        /*
        ================================================
        MAX TRADE AGE
        ================================================
        */

        const createdAt =
          new Date(
            trade.created_at
          );

        const now =
          new Date();

        const ageMinutes =

          (
            now - createdAt
          )

          /

          1000

          /

          60;

        /*
        Force close after 60 mins
        */

        if (
          ageMinutes >= 60
        ) {

          shouldClose = true;

          outcome =
            pnl >= 0
              ? "WIN"
              : "LOSS";
        }

        /*
        ================================================
        UPDATE CLOSED TRADE
        ================================================
        */

        if (
          shouldClose
        ) {

          await pool.query(

            `
            UPDATE trade_history
            SET

              pnl = $1,

              outcome = $2,

              closed_at = NOW()

            WHERE id = $3
            `,

            [

              pnl,

              outcome,

              trade.id,
            ]
          );

          /*
          ================================================
          UPDATE SIGNAL MEMORY
          ================================================
          */

          await pool.query(

            `
            UPDATE signal_memory
            SET

              signal_outcome = $1,

              future_change_percent = $2,

              outcome_checked = true

            WHERE

              symbol = $3

              AND

              outcome_checked = false
            `,

            [

              outcome,

              pnl,

              trade.symbol,
            ]
          );

          console.log(`
==================================
TRADE CLOSED
==================================

Trade ID:
${trade.id}

Symbol:
${trade.symbol}

Decision:
${trade.decision}

PnL:
${pnl}%

Outcome:
${outcome}

==================================
`);
        }

      } catch (tradeErr) {

        console.log(`
==================================
TRADE PROCESSING ERROR
==================================
`);

        console.log(tradeErr);

        console.log(`
==================================
`);
      }
    }

  } catch (err) {

    console.log(`
==================================
OUTCOME UPDATER ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);
  }
}

module.exports = {
  updateTradeOutcomes,
};
