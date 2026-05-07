const pool = require("../db/db");

async function saveTrade(trade) {
  try {
    const pnl =
      ((trade.exitPrice - trade.entryPrice) /
        trade.entryPrice) *
      100;

    await pool.query(
      `
      INSERT INTO trades (
        symbol,
        side,
        entry_price,
        exit_price,
        take_profit,
        stop_loss,
        result,
        pnl,
        opened_at,
        closed_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    `,
      [
        trade.symbol,
        "BUY",
        trade.entryPrice,
        trade.exitPrice,
        trade.takeProfit,
        trade.stopLoss,
        trade.status,
        pnl,
        trade.openedAt,
        new Date(),
      ]
    );

    console.log("Trade saved");
  } catch (error) {
    console.error("Trade save error:", error.message);
  }
}

module.exports = {
  saveTrade,
};
