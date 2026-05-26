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
        WHERE pnl IS NULL
        ORDER BY id ASC
        LIMIT 100
        `
      );

    const trades =
      tradesResult.rows;

    if (
      trades.length === 0
    ) {

      return;
    }

    for (
      const trade of trades
    ) {

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
            ) / entryPrice
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
            ) / entryPrice
          ) * 100;
      }

      /*
      ================================================
      CLOSE CONDITIONS
      ================================================
      */

      let shouldClose =
        false;

      /*
      +2% take profit
      */

      if (
        pnl >= 0.5
      ) {

        shouldClose = true;
      }

      /*
      -1% stop loss
      */

      if (
        pnl <= -0.5
      ) {

        shouldClose = true;
      }

      /*
      ================================================
      UPDATE TRADE
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

            outcome =
              CASE
                WHEN $1 > 0
                THEN 'WIN'
                ELSE 'LOSS'
              END,

            closed_at = NOW()

          WHERE id = $2
          `,

          [

            Number(
              pnl.toFixed(2)
            ),

            trade.id,
          ]
        );
      }
    }

  } catch (err) {

    console.log(

      "Outcome updater error:",

      err.message
    );
  }
}

module.exports = {
  updateTradeOutcomes,
};
