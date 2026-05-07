const pool = require("../db/db");

async function saveDecision(data) {
  try {
    await pool.query(
      `
      INSERT INTO decision_logs (
        symbol,
        latest_price,
        ema20,
        ema50,
        rsi,
        btc_bullish,
        decision,
        confidence,
        reasons
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    `,
      [
        data.symbol,
        data.latestPrice,
        data.ema20,
        data.ema50,
        data.rsi,
        data.btcBullish,
        data.decision,
        data.confidence,
        JSON.stringify(data.reasons),
      ]
    );

    console.log("Decision logged");
  } catch (error) {
    console.error(
      "Decision logging error:",
      error.message
    );
  }
}

module.exports = {
  saveDecision,
};
