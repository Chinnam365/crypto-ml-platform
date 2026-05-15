const pool =
  require("../db/db");

const {
  setActiveTrade,
  clearActiveTrade,
  getActiveTrade,
} = require("./tradeState");

// =====================================
// CREATE PAPER TRADE
// =====================================

async function createPaperTrade(

  entryPrice,

  symbol = "BTCUSDT",

  type = "BUY",

  featureId = null
) {

  const trade = {

    symbol,

    type,

    entryPrice,

    takeProfit:

      type === "BUY"

        ? entryPrice * 1.01

        : entryPrice * 0.99,

    stopLoss:

      type === "BUY"

        ? entryPrice * 0.99

        : entryPrice * 1.01,

    openedAt:
      Date.now(),

    featureId,
  };

  setActiveTrade(trade);

  console.log(
    "Paper trade opened:",
    trade
  );
}

// =====================================
// MONITOR TRADE
// =====================================

async function monitorTrade(
  currentPrice
) {

  const trade =
    getActiveTrade();

  if (!trade) {

    return;
  }

  let closed = false;

  let pnl = 0;

  // =================================
  // BUY TRADE
  // =================================

  if (trade.type === "BUY") {

    // TAKE PROFIT

    if (
      currentPrice >=
      trade.takeProfit
    ) {

      pnl =
        currentPrice -
        trade.entryPrice;

      closed = true;
    }

    // STOP LOSS

    else if (
      currentPrice <=
      trade.stopLoss
    ) {

      pnl =
        currentPrice -
        trade.entryPrice;

      closed = true;
    }
  }

  // =================================
  // SELL TRADE
  // =================================

  else if (
    trade.type === "SELL"
  ) {

    // TAKE PROFIT

    if (
      currentPrice <=
      trade.takeProfit
    ) {

      pnl =
        trade.entryPrice -
        currentPrice;

      closed = true;
    }

    // STOP LOSS

    else if (
      currentPrice >=
      trade.stopLoss
    ) {

      pnl =
        trade.entryPrice -
        currentPrice;

      closed = true;
    }
  }

  // =================================
  // CLOSE TRADE
  // =================================

  if (closed) {

    // ===============================
    // WIN / LOSS
    // ===============================

    const outcome =

      pnl >= 0

        ? "WIN"

        : "LOSS";

    try {

      // =============================
      // SAVE TRADE
      // =============================

      await pool.query(

        `
        INSERT INTO trades (

          symbol,
          type,
          entry_price,
          exit_price,
          pnl,
          outcome,
          feature_id

        )

        VALUES (

          $1,$2,$3,$4,$5,$6,$7
        )
        `,
        [

          trade.symbol,

          trade.type,

          trade.entryPrice,

          currentPrice,

          pnl,

          outcome,

          trade.featureId,
        ]
      );

      // =============================
      // UPDATE FEATURES TABLE
      // =============================

      if (trade.featureId) {

        await pool.query(

          `
          UPDATE features

          SET

            pnl = $1,
            outcome = $2

          WHERE id = $3
          `,
          [

            pnl,

            outcome,

            trade.featureId,
          ]
        );
      }

      console.log(

        `Trade closed | ${trade.symbol} | ${trade.type} | ${outcome} | PnL ${pnl.toFixed(2)}`
      );

    } catch (error) {

      console.error(

        "Trade save failed:",

        error.message
      );
    }

    // ===============================
    // CLEAR ACTIVE TRADE
    // ===============================

    clearActiveTrade();
  }
}

module.exports = {

  createPaperTrade,

  monitorTrade,
};
