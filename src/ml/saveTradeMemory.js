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
        entry_price,

        macd,
        volatility,
        trade_quality,
        overall_trend,
        buy_score,
        sell_score
trend_15m,
trend_1h,
trend_4h,
alignment_score
      )

      VALUES (

        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,

        $11,$12,$13,$14,$15,$16,
        $17,$18,$19,$20
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

        trade.macd,

        trade.volatility,

        trade.tradeQuality,

        trade.overallTrend,

        trade.buyScore,

        trade.sellScore,
        trade.trend15m,

trade.trend1h,

trade.trend4h,

trade.alignmentScore,
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
