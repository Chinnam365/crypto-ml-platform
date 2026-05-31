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

        LIMIT 100
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
    PROCESS TRADES
    ==================================================
    */

    for (
      const trade of trades
    ) {

      try {

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
NO MARKET DATA
==================================
Symbol:
${trade.symbol}
==================================
`);

          continue;
        }

        /*
        ================================================
        PRICES
        ================================================
        */

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
          !entryPrice
          ||
          entryPrice <= 0
        ) {

          console.log(`
==================================
INVALID ENTRY PRICE
==================================
Trade ID:
${trade.id}

Symbol:
${trade.symbol}

Entry Price:
${trade.entry_price}
==================================
`);

          continue;
        }

        let pnl = 0;

        /*
        ================================================
        BUY POSITION
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
              ) / entryPrice
            ) * 100;
        }

        /*
        ================================================
        SELL POSITION
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
              ) / entryPrice
            ) * 100;
        }

        /*
        ================================================
        ROUND PNL
        ================================================
        */

        pnl =
          Number(
            pnl.toFixed(2)
          );

        /*
        ================================================
        DEBUG LOG
        ================================================
        */

        console.log(`
==================================
TRADE MONITOR
==================================
Trade ID:
${trade.id}

Symbol:
${trade.symbol}

Side:
${trade.decision}

Entry:
${entryPrice}

Current:
${currentPrice}

PnL:
${pnl}%
==================================
`);

        /*
        ================================================
        CLOSE CONDITIONS
        ================================================
        */

        let shouldClose =
          false;

        let outcome =
          "LOSS";

        /*
        ================================================
        TAKE PROFIT
        ================================================
        */

        if (
          pnl >= 0.5
        ) {

          shouldClose =
            true;

          outcome =
            "WIN";

          console.log(`
==================================
TAKE PROFIT HIT
==================================
Symbol:
${trade.symbol}

PnL:
${pnl}%
==================================
`);
        }

        /*
        ================================================
        STOP LOSS
        ================================================
        */

        if (
          pnl <= -0.5
        ) {

          shouldClose =
            true;

          outcome =
            "LOSS";

          console.log(`
==================================
STOP LOSS HIT
==================================
Symbol:
${trade.symbol}

PnL:
${pnl}%
==================================
`);
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
  UPDATE positions
  SET ...
  `,
  [
    currentPrice,
    Number(pnl.toFixed(2)),
    position.id,
  ]
);

const outcome =
  pnl > 0
    ? "WIN"
    : pnl < 0
    ? "LOSS"
    : "NEUTRAL";

await pool.query(
  `
  UPDATE trade_history
  ...
  `,
  [
    Number(pnl.toFixed(2)),
    outcome,
    position.symbol
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

Outcome:
${outcome}

Final PnL:
${pnl}%
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
