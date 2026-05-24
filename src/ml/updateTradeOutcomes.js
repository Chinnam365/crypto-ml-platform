const pool =
  require("../db/db");

const {
  liveMarketData,
} = require("../market/binanceWebsocket");

async function updateTradeOutcomes() {

  try {

    // =========================
    // LOAD PENDING TRADES
    // =========================

    const result =
      await pool.query(

        `
        SELECT *
        FROM trade_history
        WHERE outcome = 'PENDING'
        `
      );

    const trades =
      result.rows;

    for (
      const trade of trades
    ) {

      const market =
        liveMarketData[
          trade.symbol
        ];

      if (!market) {
        continue;
      }

      const currentPrice =
        Number(
          market.close
        );

      const entryPrice =
        Number(
          trade.entry_price
        );

      // =========================
      // PNL CALCULATION
      // =========================

      let pnl = 0;

      if (
        trade.decision ===
        "BUY"
      ) {

        pnl =
          (
            (
              currentPrice -
              entryPrice
            ) /

            entryPrice
          ) * 100;
      }

      if (
        trade.decision ===
        "SELL"
      ) {

        pnl =
          (
            (
              entryPrice -
              currentPrice
            ) /

            entryPrice
          ) * 100;
      }

      pnl =
        Number(
          pnl.toFixed(2)
        );

      // =========================
      // WIN / LOSS LABEL
      // =========================

      let outcome =
        "PENDING";

      if (pnl > 0.3) {

        outcome = "WIN";

      } else if (
        pnl < -0.3
      ) {

        outcome = "LOSS";
      }

      // =========================
      // UPDATE DATABASE
      // =========================

      await pool.query(

        `
        UPDATE trade_history

        SET

          pnl = $1,
          outcome = $2

        WHERE id = $3
        `,

        [

          pnl,

          outcome,

          trade.id,
        ]
      );

      console.log(

        `Trade Updated: ${trade.symbol} ${outcome} ${pnl}%`
      );
    }

  } catch (err) {

    console.error(

      "Outcome Engine Error:",

      err.message
    );
  }
}

module.exports = {
  updateTradeOutcomes,
};
