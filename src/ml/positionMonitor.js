const {
  getPrice,
} = require("../market/binance");

const {
  saveMLDataset,
} = require("./datasetBuilder");

const {
  updateReinforcementMemory,
} = require("./reinforcementEngine");

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

      let closeReason = "";

      let pnl = 0;

      // ==========================================
      // BUY POSITIONS
      // ==========================================

      if (position.side === "BUY") {

        if (
          currentPrice <=
          position.stop_loss
        ) {

          shouldClose = true;

          closeReason =
            "STOP_LOSS";
        }

        if (
          currentPrice >=
          position.take_profit
        ) {

          shouldClose = true;

          closeReason =
            "TAKE_PROFIT";
        }

        pnl =
          (
            currentPrice -
            position.entry_price
          ) *
          position.position_size;
      }

      // ==========================================
      // SELL POSITIONS
      // ==========================================

      if (position.side === "SELL") {

        if (
          currentPrice >=
          position.stop_loss
        ) {

          shouldClose = true;

          closeReason =
            "STOP_LOSS";
        }

        if (
          currentPrice <=
          position.take_profit
        ) {

          shouldClose = true;

          closeReason =
            "TAKE_PROFIT";
        }

        pnl =
          (
            position.entry_price -
            currentPrice
          ) *
          position.position_size;
      }

      // ==========================================
      // TRADE DURATION
      // ==========================================

      const openedAt =
        new Date(position.opened_at);

      const now =
        new Date();

      const durationMinutes =
        (
          now - openedAt
        ) / 1000 / 60;

      // ==========================================
      // EARLY EXIT INTELLIGENCE
      // ==========================================

      // LOSS LIMIT

      if (
        pnl < -25 &&
        !shouldClose
      ) {

        shouldClose = true;

        closeReason =
          "EARLY_EXIT_LOSS";
      }

      // TRADE TOO OLD

      if (
        durationMinutes > 240 &&
        !shouldClose
      ) {

        shouldClose = true;

        closeReason =
          "TIME_EXIT";
      }

      // CONFIDENCE COLLAPSE

      if (
        position.confidence < 45 &&
        !shouldClose
      ) {

        shouldClose = true;

        closeReason =
          "CONFIDENCE_EXIT";
      }

      // ==========================================
      // CLOSE POSITION
      // ==========================================

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

        // ==========================================
        // SAVE ML DATASET
        // ==========================================

        await saveMLDataset({

          pool,

          symbol:
            position.symbol,

          side:
            position.side,

          rsi:
            position.rsi || 0,

          macd:
            position.macd || 0,

          trend:
            position.trend || "UNKNOWN",

          regime:
            position.regime || "UNKNOWN",

          volatility:
            position.volatility || 0,

          confidence:
            position.confidence || 0,

          positionSize:
            position.position_size || 0,

          pnl,

          durationMinutes,
        });

        // ==========================================
        // REINFORCEMENT MEMORY
        // ==========================================

        const quality =
          position.confidence >= 70
            ? 70
            : 50;

        await updateReinforcementMemory({

          pool,

          symbol:
            position.symbol,

          side:
            position.side,

          regime:
            position.regime,

          trend:
            position.trend,

          quality,

          confidence:
            position.confidence,

          pnl,
        });

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

Reason:
${closeReason}

Duration Minutes:
${durationMinutes.toFixed(2)}

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
