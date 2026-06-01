const pool =
  require("../db/db");

const {
  getAdaptiveSymbolWeights,
} = require("./adaptiveSymbolWeights");

const {
  generateSymbolRankings,
} = require("./symbolRankingEngine");

const {
  analyzeStrategyPerformance,
} = require("./strategyAnalytics");

/*
==================================================
ADAPTIVE CAPITAL ROTATION ENGINE
==================================================
*/

async function evaluatePortfolioRisk({

  regime = "SIDEWAYS",

  volatilityRegime = "NORMAL",
}) {

  try {

    /*
    ==================================================
    OPEN POSITIONS
    ==================================================
    */

    const openResult =
      await pool.query(

        `
        SELECT *

        FROM trade_history

        WHERE outcome = 'PENDING'

        `
      );

    const openTrades =
      openResult.rows;

    /*
    ==================================================
    SYMBOL INTELLIGENCE
    ==================================================
    */

    const symbolData =
      await getAdaptiveSymbolWeights();

    const rankingData =
  await generateSymbolRankings();
    
    /*
    ==================================================
    STRATEGY EVOLUTION
    ==================================================
    */

    const strategyAnalytics =
      await analyzeStrategyPerformance();

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
    BASE LIMITS
    ==================================================
    */

    let maxExposure = 3000;

    let maxPositions = 15;

    /*
    ==================================================
    REGIME ADAPTATION
    ==================================================
    */

    if (
      regime === "TRENDING"
    ) {

      maxExposure = 5000;

      maxPositions = 20;
    }

    else if (
      volatilityRegime === "HIGH"
    ) {

      maxExposure = 1500;

      maxPositions = 8;
    }

    /*
    ==================================================
    SYMBOL CAPITAL ALLOCATION
    ==================================================
    */

    const symbolAllocations = [];

const rankings =
  rankingData?.rankings || [];

for (
  const item of rankings
) {

  const symbol =
    item.symbol;
if (
  item.classification ===
  "SUPPRESSED"
) {

  continue;
}
  const symbolWeight =
  Number(
    item.allocation || 0
  );

      /*
      ================================================
      STRATEGY SUPPORT
      ================================================
      */

      let strategySupport = 1;

      for (
        const strategy of
        strategyAnalytics.promotedStrategies
      ) {

        if (
          strategy.strategyKey.includes(
            symbol.replace(
              "USDT",
              ""
            )
          )
        ) {

          strategySupport += 0.2;
        }
      }

      /*
      ================================================
      ALLOCATION SCORE
      ================================================
      */

      const allocationScore =

        symbolWeight *
        strategySupport;

      /*
      ================================================
      TARGET CAPITAL
      ================================================
      */

      const targetCapital =

  (
    allocationScore / 3
  ) * maxExposure;

      symbolAllocations.push({

        symbol,

        symbolWeight:
          Number(
            symbolWeight.toFixed(2)
          ),

        strategySupport:
          Number(
            strategySupport.toFixed(2)
          ),

        allocationScore:
          Number(
            allocationScore.toFixed(2)
          ),

        targetCapital:
          Number(
            targetCapital.toFixed(2)
          ),
      });
    }

    /*
    ==================================================
    SORT BEST CAPITAL TARGETS
    ==================================================
    */

    symbolAllocations.sort(
      (a, b) =>

        b.allocationScore -
        a.allocationScore
    );

    /*
    ==================================================
    PORTFOLIO RISK SCORE
    ==================================================
    */

    let riskScore = 0;

    /*
    Exposure utilization
    */

    riskScore +=

      (
        totalExposure /
        maxExposure
      ) * 60;

    /*
    Position count
    */

    /*
PHASE 2 TEST MODE

Ignore historical memory records.
*/

const effectiveOpenPositions = 0;

riskScore +=

(
  effectiveOpenPositions /
  maxPositions
) * 25;

    /*
    High volatility penalty
    */

    if (
      volatilityRegime === "HIGH"
    ) {

      riskScore += 15;
    }

    /*
    Clamp
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
    CAN TRADE
    ==================================================
    */

    let canTrade = true;

    if (
      totalExposure >=
      maxExposure
    ) {

      canTrade = false;
    }

    if (
  openTrades.length >=
  maxPositions &&
  process.env.NODE_ENV === "production_disabled"
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
ADAPTIVE CAPITAL ROTATION
==================================

Regime:
${regime}

Volatility:
${volatilityRegime}

Open Positions:
${effectiveOpenPositions}

Total Exposure:
${totalExposure.toFixed(2)}

Max Exposure:
${maxExposure}

Risk Score:
${riskScore}

Can Trade:
${canTrade}

==================================
TOP CAPITAL TARGETS
==================================
`);

    console.table(
      symbolAllocations.slice(0, 10)
    );

    console.log(`
==================================
`);

    /*
    ==================================================
    RETURN
    ==================================================
    */

    return {

      canTrade,

      riskScore,

      totalExposure:
        Number(
          totalExposure.toFixed(2)
        ),

      maxExposure,

      openPositions:
  effectiveOpenPositions,

      maxPositions,

      topAllocations:
        symbolAllocations.slice(0, 5),

      allAllocations:
        symbolAllocations,
    };

  } catch (err) {

    console.log(`
==================================
CAPITAL ROTATION ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

    return {

      canTrade: true,

      riskScore: 0,

      totalExposure: 0,

      maxExposure: 3000,

      openPositions: 0,

      maxPositions: 10,

      topAllocations: [],

      allAllocations: [],
    };
  }
}

/*
==================================================
BACKWARD COMPATIBILITY
==================================================
*/

async function getPortfolioStats() {

  const result =
    await evaluatePortfolioRisk({});

  return {

    equity:
      result.maxExposure -
      result.totalExposure,

    availableCapital:
      result.maxExposure -
      result.totalExposure,

    usedCapital:
      result.totalExposure,

    openPositions:
      result.openPositions,

    riskScore:
      result.riskScore,

    canTrade:
      result.canTrade,

    maxExposure:
      result.maxExposure,

    maxPositions:
      result.maxPositions,
  };
}

module.exports = {

  evaluatePortfolioRisk,

  getPortfolioStats,
};
