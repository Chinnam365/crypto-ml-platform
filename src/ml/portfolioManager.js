const pool =
  require("../db/db");

const {
  getRegimeStrategy,
} = require("./regimeStrategy");

/*
==================================================
PORTFOLIO INTELLIGENCE ENGINE
==================================================
*/

async function evaluatePortfolioRisk({

  regime = "SIDEWAYS",

  volatilityRegime = "NORMAL",
}) {

  try {

    /*
    ==================================================
    LOAD OPEN POSITIONS
    ==================================================
    */

    const result =
      await pool.query(

        `
        SELECT *

        FROM trade_history

        WHERE

          outcome = 'PENDING'
        `
      );

    const openTrades =
      result.rows;

    /*
    ==================================================
    TOTAL EXPOSURE
    ==================================================
    */

    let totalExposure = 0;

    for (
      const trade of openTrades
    ) {

      totalExposure +=
        Number(
          trade.position_size || 0
        );
    }

    /*
    ==================================================
    REGIME STRATEGY
    ==================================================
    */

    const strategy =
      await getRegimeStrategy({

        regime,

        volatilityRegime,

        trend: "SIDEWAYS",

        momentumState:
          "NEUTRAL",
      });

    /*
    ==================================================
    BASE LIMITS
    ==================================================
    */

    let maxPositions = 15;

    let maxExposure = 2500;

    /*
    ==================================================
    TRENDING MARKET
    ==================================================
    */

    if (
      strategy.mode ===
      "TREND_FOLLOWING"
    ) {

      maxPositions = 20;

      maxExposure = 4000;
    }

    /*
    ==================================================
    DEFENSIVE MARKET
    ==================================================
    */

    else if (
      strategy.mode ===
      "DEFENSIVE"
    ) {

      maxPositions = 8;

      maxExposure = 1200;
    }

    /*
    ==================================================
    MEAN REVERSION
    ==================================================
    */

    else if (
      strategy.mode ===
      "MEAN_REVERSION"
    ) {

      maxPositions = 10;

      maxExposure = 1800;
    }

    /*
    ==================================================
    SYMBOL CONCENTRATION
    ==================================================
    */

    const symbolCounts = {};

    for (
      const trade of openTrades
    ) {

      const symbol =
        trade.symbol;

      if (
        !symbolCounts[symbol]
      ) {

        symbolCounts[symbol] = 0;
      }

      symbolCounts[symbol]++;
    }

    /*
    ==================================================
    CONCENTRATION RISK
    ==================================================
    */

    let concentrationRisk =
      false;

    for (
      const symbol of
      Object.keys(symbolCounts)
    ) {

      if (
        symbolCounts[symbol] >= 5
      ) {

        concentrationRisk =
          true;
      }
    }

    /*
    ==================================================
    PORTFOLIO RISK SCORE
    ==================================================
    */

    let riskScore = 0;

    /*
    Exposure
    */

    riskScore +=

      (
        totalExposure /
        maxExposure
      ) * 50;

    /*
    Position count
    */

    riskScore +=

      (
        openTrades.length /
        maxPositions
      ) * 30;

    /*
    Concentration
    */

    if (
      concentrationRisk
    ) {

      riskScore += 20;
    }

    /*
    ==================================================
    CLAMPING
    ==================================================
    */

    riskScore =

      Math.max(
        0,
        Math.min(
          riskScore,
          100
        )
      );

    riskScore =
      Number(
        riskScore.toFixed(2)
      );

    /*
    ==================================================
    FINAL DECISION
    ==================================================
    */

    let canTrade = true;

    if (
      openTrades.length >=
      maxPositions
    ) {

      canTrade = false;
    }

    if (
      totalExposure >=
      maxExposure
    ) {

      canTrade = false;
    }

    if (
      riskScore >= 85
    ) {

      canTrade = false;
    }

    /*
    ==================================================
    LOGGING
    ==================================================
    */

    console.log(`
==================================
PORTFOLIO INTELLIGENCE
==================================

Strategy Mode:
${strategy.mode}

Open Positions:
${openTrades.length}

Max Positions:
${maxPositions}

Total Exposure:
${totalExposure.toFixed(2)}

Max Exposure:
${maxExposure}

Risk Score:
${riskScore}

Concentration Risk:
${concentrationRisk}

Can Trade:
${canTrade}

==================================
`);

    return {

      canTrade,

      openPositions:
        openTrades.length,

      maxPositions,

      totalExposure:
        Number(
          totalExposure.toFixed(2)
        ),

      maxExposure,

      concentrationRisk,

      riskScore,

      strategyMode:
        strategy.mode,
    };

  } catch (err) {

    console.log(`
==================================
PORTFOLIO INTELLIGENCE ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

    return {

      canTrade: true,

      openPositions: 0,

      maxPositions: 10,

      totalExposure: 0,

      maxExposure: 1000,

      concentrationRisk: false,

      riskScore: 0,

      strategyMode:
        "BALANCED",
    };
  }
}

module.exports = {
  evaluatePortfolioRisk,
};
