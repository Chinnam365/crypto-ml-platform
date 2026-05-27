const pool =
  require("../db/db");

/*
==================================================
SAVE SIGNAL MEMORY
==================================================
*/

async function saveSignalMemory(data = {}) {

  try {

    console.log(`
==================================
ATTEMPTING SIGNAL MEMORY SAVE
==================================
`);

    const result =
      await pool.query(

        `
        INSERT INTO signal_memory (

          symbol,
          decision,
          confidence,
          signal_quality,
          market_bias,
          trend,
          overall_trend,
          trend_15m,
          trend_1h,
          trend_4h,
          alignment_score,
          momentum_state,
          momentum_strength,
          volatility_regime,
          regime,
          rsi,
          ema_distance,
          exploration_trade,
          market_hour,
          market_day,
          is_weekend,
          previous_trend,
          previous_regime,
          previous_volatility_regime,
          transition_type,
          signal_price,
          market_state,
          market_state_transition

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
          $28
        )

        RETURNING id
        `,

        [

          data.symbol,
          data.decision,
          data.confidence,
          data.signalQuality,
          data.marketBias,
          data.trend,
          data.overallTrend,
          data.trend15m,
          data.trend1h,
          data.trend4h,
          data.alignmentScore,
          data.momentumState,
          data.momentumStrength,
          data.volatilityRegime,
          data.regime,
          data.rsi,
          data.emaDistance,
          data.explorationTrade,
          data.marketHour,
          data.marketDay,
          data.isWeekend,
          data.previousTrend,
          data.previousRegime,
          data.previousVolatilityRegime,
          data.transitionType,
          data.signalPrice,
          data.marketState,
          data.marketStateTransition,
        ]
      );

    console.log(`
==================================
SIGNAL MEMORY SAVED
==================================
ID:
${result.rows[0].id}
==================================
`);

  } catch (err) {

    console.log(`
==================================
SIGNAL MEMORY SAVE ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);
  }
}

module.exports = {
  saveSignalMemory,
};
