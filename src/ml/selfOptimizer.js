const pool =
  require("../db/db");

/*
==================================================
SELF-HEALING AI INTELLIGENCE
==================================================
*/

async function optimizeSystemBehavior() {

  try {

    /*
    ==================================================
    LOAD RECENT TRADES
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

        LIMIT 500
        `
      );

    const trades =
      result.rows;

    /*
    ==================================================
    DEFAULT RESPONSE
    ==================================================
    */

    if (
      trades.length < 30
    ) {

      return {

        explorationRate: 0.3,

        exploitationRate: 0.7,

        confidenceMultiplier: 1,

        thresholdAdjustment: 0,

        healingMode: false,

        degradationScore: 0,
      };
    }

    /*
    ==================================================
    METRICS
    ==================================================
    */

    let wins = 0;

    let losses = 0;

    let totalPnL = 0;

    let consecutiveLosses = 0;

    let maxConsecutiveLosses = 0;

    /*
    ==================================================
    PROCESS TRADES
    ==================================================
    */

    for (
      const trade of trades
    ) {

      const pnl =
        Number(
          trade.pnl || 0
        );

      totalPnL += pnl;

      if (
        trade.outcome === "WIN"
      ) {

        wins++;

        consecutiveLosses = 0;
      }

      else if (
        trade.outcome === "LOSS"
      ) {

        losses++;

        consecutiveLosses++;

        if (

          consecutiveLosses >

          maxConsecutiveLosses
        ) {

          maxConsecutiveLosses =
            consecutiveLosses;
        }
      }
    }

    /*
    ==================================================
    PERFORMANCE
    ==================================================
    */

    const totalTrades =
      wins + losses;

    const winRate =

      totalTrades > 0

        ? (
            wins /
            totalTrades
          ) * 100

        : 0;

    const avgPnL =

      totalTrades > 0

        ? (
            totalPnL /
            totalTrades
          )

        : 0;

    /*
    ==================================================
    DEGRADATION SCORE
    ==================================================
    */

    let degradationScore = 0;

    /*
    Poor win rate
    */

    if (
      winRate < 45
    ) {

      degradationScore += 25;
    }

    /*
    Negative profitability
    */

    if (
      avgPnL < 0
    ) {

      degradationScore += 25;
    }

    /*
    Loss streaks
    */

    degradationScore +=

      maxConsecutiveLosses * 4;

    /*
    Clamp
    */

    degradationScore =

      Math.max(
        0,
        Math.min(
          degradationScore,
          100
        )
      );

    degradationScore =
      Number(
        degradationScore.toFixed(2)
      );

    /*
    ==================================================
    SELF-HEALING MODE
    ==================================================
    */

    let healingMode =
      false;

    if (
      degradationScore >= 60
    ) {

      healingMode = true;
    }

    /*
    ==================================================
    EXPLORATION / EXPLOITATION
    ==================================================
    */

    let explorationRate = 0.3;

    let exploitationRate = 0.7;

    /*
    Healing mode explores carefully
    */

    if (
      healingMode
    ) {

      explorationRate = 0.15;

      exploitationRate = 0.85;
    }

    /*
    Weak system explores more
    */

    else if (
      winRate < 45
    ) {

      explorationRate = 0.5;

      exploitationRate = 0.5;
    }

    /*
    Strong system exploits more
    */

    else if (
      winRate > 60
    ) {

      explorationRate = 0.1;

      exploitationRate = 0.9;
    }

    /*
    ==================================================
    CONFIDENCE MULTIPLIER
    ==================================================
    */

    let confidenceMultiplier = 1;

    if (
      avgPnL > 0.5
    ) {

      confidenceMultiplier = 1.15;
    }

    else if (
      avgPnL < -0.5
    ) {

      confidenceMultiplier = 0.8;
    }

    /*
    Healing mode defensive reduction
    */

    if (
      healingMode
    ) {

      confidenceMultiplier *= 0.7;
    }

    confidenceMultiplier =
      Number(
        confidenceMultiplier.toFixed(2)
      );

    /*
    ==================================================
    THRESHOLD ADJUSTMENT
    ==================================================
    */

    let thresholdAdjustment = 0;

    if (
      winRate > 65
    ) {

      thresholdAdjustment = -5;
    }

    else if (
      winRate < 40
    ) {

      thresholdAdjustment = 8;
    }

    /*
    Healing mode stricter
    */

    if (
      healingMode
    ) {

      thresholdAdjustment += 10;
    }

    /*
    ==================================================
    AUTONOMOUS SAFETY RESPONSE
    ==================================================
    */

    let tradingAllowed =
      true;

    if (
      degradationScore >= 85
    ) {

      tradingAllowed =
        false;
    }

    /*
    ==================================================
    LOGGING
    ==================================================
    */

    console.log(`
==================================
SELF-HEALING AI INTELLIGENCE
==================================

Win Rate:
${winRate.toFixed(2)}%

Avg PnL:
${avgPnL.toFixed(2)}

Max Consecutive Losses:
${maxConsecutiveLosses}

Degradation Score:
${degradationScore}

Healing Mode:
${healingMode}

Trading Allowed:
${tradingAllowed}

Exploration Rate:
${explorationRate}

Exploitation Rate:
${exploitationRate}

Confidence Multiplier:
${confidenceMultiplier}

Threshold Adjustment:
${thresholdAdjustment}

==================================
`);

    /*
    ==================================================
    RETURN
    ==================================================
    */

    return {

      explorationRate:
        Number(
          explorationRate.toFixed(2)
        ),

      exploitationRate:
        Number(
          exploitationRate.toFixed(2)
        ),

      confidenceMultiplier,

      thresholdAdjustment,

      healingMode,

      degradationScore,

      tradingAllowed,
    };

  } catch (err) {

    console.log(`
==================================
SELF-HEALING ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

    return {

      explorationRate: 0.3,

      exploitationRate: 0.7,

      confidenceMultiplier: 1,

      thresholdAdjustment: 0,

      healingMode: false,

      degradationScore: 0,

      tradingAllowed: true,
    };
  }
}

module.exports = {
  optimizeSystemBehavior,
};
