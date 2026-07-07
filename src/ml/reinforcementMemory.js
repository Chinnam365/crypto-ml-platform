const pool =
  require("../db/db");

/*
==================================================
REINFORCEMENT MEMORY ENGINE
==================================================
*/

async function getReinforcementScore({

  symbol,

  trend,

  momentumState,

  volatilityRegime,

  overallTrend,
}) {

  try {

    /*
    ==================================================
    LOAD HISTORICAL TRADES
    ==================================================
    */

    const result =
      await pool.query(

        `
        SELECT *
        FROM trade_history
        WHERE
  symbol = $1
  AND trend = $2
  AND overall_trend = $3
  AND volatility_regime = $4
        ORDER BY id DESC
        LIMIT 100
        `,

        [

          symbol,
  trend,
  overallTrend,
  volatilityRegime,
        ]
      );

    const trades =
      result.rows;
// ==========================================
// LEVEL 2 - PATTERN MEMORY
// ==========================================

let patternTrades = [];

if (trades.length < 20) {

    const patternResult =
        await pool.query(

`
SELECT *
FROM trade_history
WHERE

trend = $1
AND overall_trend = $2
AND volatility_regime = $3

ORDER BY id DESC
LIMIT 200
`,

[
    trend,
    overallTrend,
    volatilityRegime
]

);

    patternTrades =
        patternResult.rows;

    console.log(`
==================================
PATTERN MEMORY
==================================

Exact Matches:
${trades.length}

Pattern Matches:
${patternTrades.length}

==================================
`);

}
    /*
    ==================================================
    NOT ENOUGH DATA
    ==================================================
    */

    if (
      trades.length < 20
    ) {

      return {

        reinforcementScore: 50,

        winRate: 0,

        sampleSize:
          trades.length,
      };
    }

    /*
    ==================================================
    CALCULATE WIN RATE
    ==================================================
    */

    let wins = 0;

    for (
      const trade of trades
    ) {

      const pnl =
        Number(
          trade.pnl || 0
        );

      if (pnl > 0) {
        wins++;
      }
    }

    const winRate =
      (
        wins /
        trades.length
      ) * 100;

    /*
    ==================================================
    REINFORCEMENT SCORE
    ==================================================
    */

    let reinforcementScore =
      50;

    if (
      winRate >= 70
    ) {

      reinforcementScore = 90;
    }

    else if (
      winRate >= 60
    ) {

      reinforcementScore = 75;
    }

    else if (
      winRate >= 50
    ) {

      reinforcementScore = 60;
    }

    else if (
      winRate >= 40
    ) {

      reinforcementScore = 45;
    }

    else {

      reinforcementScore = 30;
    }

    /*
    ==================================================
    MOMENTUM BONUS
    ==================================================
    */

    if (

      momentumState ===
      "BULLISH_ACCELERATION"

      &&

      winRate >= 60
    ) {

      reinforcementScore += 5;
    }

    if (
      reinforcementScore > 100
    ) {

      reinforcementScore = 100;
    }

    return {

      reinforcementScore,

      winRate:
        Number(
          winRate.toFixed(2)
        ),

      sampleSize:
        trades.length,
    };

  } catch (err) {

    console.log(

      "Reinforcement error:",

      err.message
    );

    return {

      reinforcementScore: 50,

      winRate: 0,

      sampleSize: 0,
    };
  }
}

module.exports = {
  getReinforcementScore,
};
