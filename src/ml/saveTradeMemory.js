const pool =
  require("../db/db");

async function saveTradeMemory(
  trade
) {

  try {

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
