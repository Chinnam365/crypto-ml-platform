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

    // ==========================================
// HIERARCHICAL MEMORY
// ==========================================

const memoryTrades =

    trades.length >= 20

        ? trades

        : patternTrades;

if (memoryTrades.length < 20) {

    return {

        reinforcementScore: 50,

        matches: memoryTrades.length,

        source: "DEFAULT"

    };

}
console.log(`
==================================
MEMORY SOURCE
==================================

Symbol:
${symbol}

Using:
${trades.length >= 20 ? "EXACT" : "PATTERN"}

Exact Trades:
${trades.length}

Pattern Trades:
${patternTrades.length}

==================================
`);
    /*
    ==================================================
    CALCULATE WIN RATE
    ==================================================
    */

    let wins = 0;

    for (
      const trade of memoryTrades
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
        memoryTrades.length
      ) * 100;
/*
==================================================
LEARNING METRICS
==================================================
*/

let totalPnL = 0;
let totalReward = 0;
let recentPnL = 0;

const recentTrades =
    memoryTrades.slice(0, 20);

for (const trade of memoryTrades) {

    totalPnL += Number(trade.pnl || 0);

    totalReward += Number(trade.reward || 0);
}

for (const trade of recentTrades) {

    recentPnL += Number(trade.pnl || 0);
}

const avgPnL =
    totalPnL / memoryTrades.length;

const avgReward =
    totalReward / memoryTrades.length;

const recentAvgPnL =
    recentPnL / recentTrades.length;

const sampleConfidence =
    Math.min(
        memoryTrades.length / 100,
        1
    );
    /*
    ==================================================
    REINFORCEMENT SCORE
    ==================================================
    */

    /*
==================================================
MULTI-FACTOR REINFORCEMENT SCORE
==================================================
*/

let reinforcementScore = 50;

// Win Rate

reinforcementScore +=
    (winRate - 50) * 0.6;

// Average PnL

reinforcementScore +=
    avgPnL * 1.5;

// Average Reward

reinforcementScore +=
    avgReward * 6;

// Recent Performance

reinforcementScore +=
    recentAvgPnL * 0.8;

// Sample Confidence

reinforcementScore *=
    (0.6 + sampleConfidence * 0.4);

// Momentum Bonus

if (
    momentumState === "BULLISH_ACCELERATION" &&
    recentAvgPnL > 0
) {
    reinforcementScore += 3;
}

// Clamp

reinforcementScore =
    Math.max(
        0,
        Math.min(100, reinforcementScore)
    ); =
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
        memoryTrades.length,
    };

  } catch (err) {

    console.log(

      "Reinforcement error:",

      err.message
    );

    return {

    reinforcementScore,

    winRate:
        Number(winRate.toFixed(2)),

    avgPnL:
        Number(avgPnL.toFixed(2)),

    avgReward:
        Number(avgReward.toFixed(2)),

    recentAvgPnL:
        Number(recentAvgPnL.toFixed(2)),

    sampleSize:
        memoryTrades.length,
};
  }
}

module.exports = {
  getReinforcementScore,
};
