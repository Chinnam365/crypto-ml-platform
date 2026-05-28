const pool =
  require("../db/db");

/*
==================================================
SAVE TRADE MEMORY
==================================================
*/

async function saveTradeMemory(data = {}) {

  try {

    console.log(`
==================================
ATTEMPTING TRADE MEMORY SAVE
==================================
`);

    const result =
      await pool.query(

        `
        INSERT INTO trade_history (

          symbol,
          decision,
          confidence,
          signal_quality,
          trend,
          trend_15m,
          trend_1h,
          trend_4h,
          alignment_score,
          regime,
          volatility_regime,
          rsi,
          ema_distance,
          entry_price,
          market_hour,
          market_day,
          is_weekend,
          previous_trend,
          previous_regime,
          previous_volatility_regime,
          transition_type,
          market_state,
          market_state_transition,
          macd,
          volatility,
          trade_quality,
          overall_trend,
          buy_score,
          sell_score

        )

        VALUES (

          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12,
          $13,
          $14,
          $15,
          $16,
          $17,
          $18,
          $19,
          $20,
          $21,
          $22,
          $23,
          $24,
          $25,
          $26,
          $27,
          $28,
          $29
        )

        RETURNING id
        `,

        [

          data.symbol,
          data.decision,
          data.confidence,
          data.signalQuality,
          data.trend,
          data.trend15m,
          data.trend1h,
          data.trend4h,
          data.alignmentScore,
          data.regime,
          data.volatilityRegime,
          data.rsi,
          data.emaDistance,
          data.entryPrice,
          data.marketHour,
          data.marketDay,
          data.isWeekend,
          data.previousTrend,
          data.previousRegime,
          data.previousVolatilityRegime,
          data.transitionType,
          data.marketState,
          data.marketStateTransition,
          data.macd,
          data.volatility,
          data.tradeQuality,
          data.overallTrend,
          data.buyScore,
          data.sellScore,
        ]
      );

    console.log(`
==================================
TRADE MEMORY SAVED
==================================

Trade ID:
${result.rows[0].id}

Symbol:
${data.symbol}

Decision:
${data.decision}

==================================
`);

  } catch (err) {

    console.log(`
==================================
TRADE MEMORY SAVE ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);
  }
}

module.exports = {
  saveTradeMemory,
};
