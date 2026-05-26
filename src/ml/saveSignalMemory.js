const pool =
  require("../db/db");

/*
==================================================
SAVE SIGNAL MEMORY
==================================================
*/

async function saveSignalMemory({

  symbol,

  decision,

  confidence,

  signalQuality,

  marketBias,

  trend,

  overallTrend,

  trend15m,

  trend1h,

  trend4h,

  alignmentScore,

  momentumState,

  momentumStrength,

  volatilityRegime,

  regime,

  rsi,

  emaDistance,

  explorationTrade = false,
}) {

  try {

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

        exploration_trade

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
        $18
      )
      `,

      [

        symbol,

        decision,

        confidence,

        signalQuality,

        marketBias,

        trend,

        overallTrend,

        trend15m,

        trend1h,

        trend4h,

        alignmentScore,

        momentumState,

        momentumStrength,

        volatilityRegime,

        regime,

        rsi,

        emaDistance,

        explorationTrade,
      ]
    );

  } catch (err) {

    console.log(

      "Signal memory error:",

      err.message
    );
  }
}

module.exports = {
  saveSignalMemory,
};
