const pool =
  require("../db/db");

async function saveTradeMemory(
  trade
) {

  try {

    // =========================
    // DUPLICATE CHECK
    // =========================

    const existingTrade =
      await pool.query(

        `
        SELECT *
        FROM trade_history

        WHERE

          symbol = $1

          AND

          decision = $2

          AND

          outcome = 'PENDING'

        LIMIT 1
        `,

        [

          trade.symbol,

          trade.decision,
        ]
      );

    // =========================
    // SKIP DUPLICATES
    // =========================

    if (
      existingTrade.rows.length > 0
    ) {

      console.log(

        `Duplicate trade skipped: ${trade.symbol}`
      );

      return;
    }

    // =========================
    // SAVE TRADE
    // =========================

    await pool.query(

      `
      INSERT INTO trade_history (

        symbol,
        decision,
        confidence,
        signal_quality,
        trend,
        regime,
        volatility_regime,
        rsi,
        ema_distance,
        entry_price

      )

      VALUES (

        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
      )
      `,

      [

        trade.symbol,

        trade.decision,

        trade.confidence,

        trade.signalQuality,

        trade.trend,

        trade.regime,

        trade.volatilityRegime,

        trade.rsi,

        trade.emaDistance,

        trade.entryPrice,
      ]
    );

    console.log(

      `Trade memory saved: ${trade.symbol}`
    );

  } catch (err) {

    console.error(

      "Trade Memory Error:",

      err.message
    );
  }
}

module.exports = {
  saveTradeMemory,
};
