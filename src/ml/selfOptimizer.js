const pool =
  require("../db/db");

/*
==================================================
SELF OPTIMIZER
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

        LIMIT 300
        `
      );

    const trades =
      result.rows;

    /*
    ==================================================
    MINIMUM DATA
    ==================================================
    */

    if (
      trades.length < 30
    ) {

      return {

        explorationRate: 0.4,

        exploitationRate: 0.6,

        confidenceMultiplier: 1,

        thresholdAdjustment: 0,
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

    for (
      const trade of trades
    ) {

      if (
        trade.outcome === "WIN"
      ) {

        wins++;
      }

      else if (
        trade.outcome === "LOSS"
      ) {

        losses++;
      }

      totalPnL +=
        Number(
          trade.pnl || 0
        );
    }

    const totalTrades =
      wins + losses;

    const winRate =

      totalTrades > 0

        ? (wins / totalTrades) * 100

        : 0;

    const avgPnL =

      totalTrades > 0

        ? totalPnL / totalTrades

        : 0;

    /*
    ==================================================
    EXPLORATION / EXPLOITATION
    ==================================================
    */

    let explorationRate = 0.3;

    let exploitationRate = 0.7;

    /*
    ==================================================
    LOSING SYSTEM
    EXPLORE MORE
    ==================================================
    */

    if (
      winRate < 45
    ) {

      explorationRate = 0.6;

      exploitationRate = 0.4;
    }

    /*
    ==================================================
    STRONG SYSTEM
    EXPLOIT MORE
    ==================================================
    */

    else if (
      winRate > 60
    ) {

      explorationRate = 0.15;

      exploitationRate = 0.85;
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

      confidenceMultiplier = 0.85;
    }

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

      thresholdAdjustment = 5;
    }

    /*
    ==================================================
    FINAL OUTPUT
    ==================================================
    */

    const output = {

      winRate:
        Number(
          winRate.toFixed(2)
        ),

      avgPnL:
        Number(
          avgPnL.toFixed(2)
        ),

      explorationRate:
        Number(
          explorationRate.toFixed(2)
        ),

      exploitationRate:
        Number(
          exploitationRate.toFixed(2)
        ),

      confidenceMultiplier:
        Number(
          confidenceMultiplier.toFixed(2)
        ),

      thresholdAdjustment,
    };

    console.log(`
==================================
SELF OPTIMIZER
==================================

Win Rate:
${output.winRate}%

Avg PnL:
${output.avgPnL}

Exploration Rate:
${output.explorationRate}

Exploitation Rate:
${output.exploitationRate}

Confidence Multiplier:
${output.confidenceMultiplier}

Threshold Adjustment:
${output.thresholdAdjustment}

==================================
`);

    return output;

  } catch (err) {

    console.log(`
==================================
SELF OPTIMIZER ERROR
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
    };
  }
}

module.exports = {
  optimizeSystemBehavior,
};
