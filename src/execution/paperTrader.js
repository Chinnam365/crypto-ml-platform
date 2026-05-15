const pool =
  require("../db/pool");

const {
  setActiveTrade,
  clearActiveTrade,
  getActiveTrade,
} = require("./tradeState");

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
      entryPrice * 1.01,

    stopLoss:
      entryPrice * 0.99,

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

  // =========================
  // BUY
  // =========================

  if (trade.type === "BUY") {

    if (
      currentPrice >=
      trade.takeProfit
    ) {

      pnl =
        currentPrice -
        trade.entryPrice;

      closed = true;
    }

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

  // =========================
  // SELL
  // =========================

  else {

    if (
      currentPrice <=
      trade.takeProfit
    ) {

      pnl =
        trade.entryPrice -
        currentPrice;

      closed = true;
    }

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

  // =========================
  // CLOSE TRADE
  // =========================

  if (closed) {

    const outcome =
      pnl >= 0
        ? "WIN"
        : "LOSS";

    try {

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

      // =====================
      // UPDATE FEATURES
      // =====================

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

    } catch (error) {

      console.error(
        "Trade save failed:",
        error.message
      );
    }

    console.log(

      `Trade closed | ${outcome} | PnL ${pnl.toFixed(2)}`
    );

    clearActiveTrade();
  }
}

module.exports = {
  createPaperTrade,
  monitorTrade,
};
