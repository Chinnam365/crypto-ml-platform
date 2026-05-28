const pool =
  require("../db/db");

/*
==================================================
ADAPTIVE FEATURE WEIGHTS
==================================================
*/

async function getAdaptiveWeights() {

  try {

    /*
    ==================================================
    LOAD COMPLETED TRADES
    ==================================================
    */

    const result =
      await pool.query(

        `
        SELECT *

        FROM trade_history

        WHERE

          outcome IS NOT NULL

          AND

          outcome != 'PENDING'

        ORDER BY id DESC

        LIMIT 1000
        `
      );

    const trades =
      result.rows;

    /*
    ==================================================
    DEFAULT WEIGHTS
    ==================================================
    */

    const weights = {

      rsi: 1,

      macd: 1,

      trend: 1,

      volatility: 1,

      alignment: 1,

      momentum: 1,
    };

    /*
    ==================================================
    MINIMUM SAMPLE SIZE
    ==================================================
    */

    if (
      trades.length < 30
    ) {

      return weights;
    }

    /*
    ==================================================
    FEATURE TRACKERS
    ==================================================
    */

    const stats = {

      rsi: {
        wins: 0,
        total: 0,
      },

      macd: {
        wins: 0,
        total: 0,
      },

      trend: {
        wins: 0,
        total: 0,
      },

      volatility: {
        wins: 0,
        total: 0,
      },

      alignment: {
        wins: 0,
        total: 0,
      },

      momentum: {
        wins: 0,
        total: 0,
      },
    };

    /*
    ==================================================
    PROCESS TRADES
    ==================================================
    */

    for (
      const trade of trades
    ) {

      const isWin =
        trade.outcome === "WIN";

      /*
      ================================================
      RSI
      ================================================
      */

      if (

        Number(trade.rsi) < 35

        ||

        Number(trade.rsi) > 65
      ) {

        stats.rsi.total++;

        if (isWin) {
          stats.rsi.wins++;
        }
      }

      /*
      ================================================
      MACD
      ================================================
      */

      if (
        Math.abs(
          Number(trade.macd || 0)
        ) > 0.5
      ) {

        stats.macd.total++;

        if (isWin) {
          stats.macd.wins++;
        }
      }

      /*
      ================================================
      TREND
      ================================================
      */

      if (
        trade.trend !== "SIDEWAYS"
      ) {

        stats.trend.total++;

        if (isWin) {
          stats.trend.wins++;
        }
      }

      /*
      ================================================
      VOLATILITY
      ================================================
      */

      if (
        trade.volatility_regime ===
        "HIGH"
      ) {

        stats.volatility.total++;

        if (isWin) {
          stats.volatility.wins++;
        }
      }

      /*
      ================================================
      ALIGNMENT
      ================================================
      */

      if (
        Number(
          trade.alignment_score
        ) >= 70
      ) {

        stats.alignment.total++;

        if (isWin) {
          stats.alignment.wins++;
        }
      }

      /*
      ================================================
      MOMENTUM
      ================================================
      */

      if (

        trade.momentum_state ===
        "BULLISH_ACCELERATION"

        ||

        trade.momentum_state ===
        "BEARISH_ACCELERATION"
      ) {

        stats.momentum.total++;

        if (isWin) {
          stats.momentum.wins++;
        }
      }
    }

    /*
    ==================================================
    CALCULATE WEIGHTS
    ==================================================
    */

    for (
      const feature of
      Object.keys(stats)
    ) {

      const total =
        stats[feature].total;

      const wins =
        stats[feature].wins;

      if (
        total === 0
      ) {

        continue;
      }

      const winRate =

        wins / total;

      /*
      ================================================
      WEIGHT CALCULATION
      ================================================
      */

      let weight =

        0.5 +
        (winRate * 1.5);

      /*
      ================================================
      CLAMPING
      ================================================
      */

      weight =

        Math.max(
          0.5,
          Math.min(
            weight,
            2
          )
        );

      weights[feature] =
        Number(
          weight.toFixed(2)
        );
    }

    console.log(`
==================================
ADAPTIVE FEATURE WEIGHTS
==================================
`);

    console.log(weights);

    console.log(`
==================================
`);

    return weights;

  } catch (err) {

    console.log(`
==================================
ADAPTIVE WEIGHTS ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

    return {

      rsi: 1,

      macd: 1,

      trend: 1,

      volatility: 1,

      alignment: 1,

      momentum: 1,
    };
  }
}

module.exports = {
  getAdaptiveWeights,
};
