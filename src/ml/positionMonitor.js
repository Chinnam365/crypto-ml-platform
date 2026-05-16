const {
  getPrice,
} = require("../market/binance");

async function monitorPositions(pool) {

  const result =
    await pool.query(`
      SELECT *
      FROM positions
      WHERE status = 'OPEN'
    `);

  const positions =
    result.rows;

  for (const position of positions) {

    try {

      const currentPrice =
        await getPrice(
          position.symbol
        );

      if (!currentPrice) {

        continue;
      }

      let shouldClose = false;

      let pnl = 0;

      // =========================
      // BUY POSITIONS
      // =========================

      if (position.side === "BUY") {

        if (
          currentPrice <=
          position.stop_loss
        ) {

          shouldClose = true;
        }

        if (
          currentPrice >=
          position.take_profit
        ) {

          shouldClose = true;
        }

        pnl =
          (
            currentPrice -
            position.entry_price
          ) *
          position.position_size;
      }

      // =========================
      // SELL POSITIONS
      // =========================

      if (position.side === "SELL") {

        if (
          currentPrice >=
          position.stop_loss
        ) {

          shouldClose = true;
        }

        if (
          currentPrice <=
          position.take_profit
        ) {

          shouldClose = true;
        }

        pnl =
          (
            position.entry_price -
            currentPrice
          ) *
          position.position_size;
      }

      // =========================
      // CLOSE POSITION
      // =========================

      if (shouldClose) {

        await pool.query(
          `
          UPDATE positions
          SET
            status = 'CLOSED',

            exit_price = $1,

            pnl = $2,

            closed_at = NOW()

          WHERE id = $3
          `,
          [
            currentPrice,

            Number(
              pnl.toFixed(2)
            ),

            position.id,
          ]
        );

        console.log(`
==================================
POSITION CLOSED
==================================

Symbol:
${position.symbol}

Side:
${position.side}

Exit Price:
${currentPrice}

PnL:
${pnl.toFixed(2)}

==================================
`);
      }

    } catch (err) {

      console.error(
        "Position monitor error:",
        err.message
      );
    }
  }
}

module.exports = {
  monitorPositions,
};
