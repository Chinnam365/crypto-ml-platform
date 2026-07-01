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

console.log(`
==================================
MONITOR DEBUG
==================================

Open Positions Found:
${positions.length}

==================================
`);
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
console.log(`
==================================
STOP LOSS TRIGGER
==================================

Symbol:
${position.symbol}

Entry:
${position.entry_price}

Current:
${currentPrice}

Stored Stop:
${position.stop_loss}

Difference To Stop:
${(
(
currentPrice -
position.stop_loss
)
/
position.stop_loss
* 100
).toFixed(2)}%

==================================
`);
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
    (
      currentPrice -
      position.entry_price
    )
    /
    position.entry_price
  ) * 100;
      }

      // ==========================================
      // SELL POSITIONS
      // ==========================================

      if (position.side === "SELL") {

        if (
          currentPrice >=
          position.stop_loss
        ) {
console.log(`
==================================
STOP LOSS TRIGGER
==================================

Symbol:
${position.symbol}

Entry:
${position.entry_price}

Current:
${currentPrice}

Stored Stop:
${position.stop_loss}

Difference To Stop:
${(
(
currentPrice -
position.stop_loss
)
/
position.stop_loss
* 100
).toFixed(2)}%

==================================
`);
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
    (
      position.entry_price -
      currentPrice
    )
    /
    position.entry_price
  ) * 100;
      }
pnl =
  Number(
    pnl.toFixed(2)
  );
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

     const pnlPercent =

  position.side === "BUY"

  ? (
      (
        currentPrice -
        position.entry_price
      )
      /
      position.entry_price
    ) * 100

  : (
      (
        position.entry_price -
        currentPrice
      )
      /
      position.entry_price
    ) * 100;

if (
  pnlPercent < -8 &&
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
console.log(`
==================================
STOP LOSS DEBUG
==================================
Symbol: ${position.symbol}
Entry Price: ${position.entry_price}
Current Price: ${currentPrice}
Stored Stop Loss: ${position.stop_loss}
Stored Take Profit: ${position.take_profit}
Close Reason: ${closeReason}
PnL Percent:
${pnlPercent.toFixed(2)}%
==================================
`);
        await pool.query(
          `
          UPDATE positions
          SET
status = 'CLOSED',

exit_price = $1,

pnl = $2,

outcome = $3,

close_reason = $4,

closed_at = NOW()

          WHERE id = $5
          `,
          [
currentPrice,

Number(
pnl.toFixed(2)
),

pnl > 0
  ? "WIN"
  : pnl < 0
    ? "LOSS"
    : "NEUTRAL",

closeReason,

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

        // ==========================================
// SAVE TRADE HISTORY
// ==========================================

await pool.query(
`
INSERT INTO trade_history
(
symbol,
decision,
entry_price,
exit_price,
pnl,
outcome,
created_at,
closed_at
)
VALUES
(
$1,$2,$3,$4,$5,$6,$7,NOW()
)
`,
[
position.symbol,
position.side,
position.entry_price,
currentPrice,
pnl,
pnl > 0
  ? "WIN"
  : pnl < 0
    ? "LOSS"
    : "NEUTRAL",
position.opened_at
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
