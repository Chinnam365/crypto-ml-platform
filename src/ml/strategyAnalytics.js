const pool =
  require("../db/db");
/*
==================================================
STRATEGY CACHE
==================================================
*/

let cachedAnalytics = null;
let cacheTimestamp = 0;

const CACHE_DURATION_MS = 60000;

/*
==================================================
AUTONOMOUS STRATEGY EVOLUTION
==================================================
*/

async function analyzeStrategyPerformance() {

  try {

    /*
    ==================================================
    LOAD COMPLETED TRADES
    ==================================================
    */
const now = Date.now();

if (

    cachedAnalytics &&

    (now - cacheTimestamp) < CACHE_DURATION_MS

) {

    return cachedAnalytics;

}
  const result =
  await pool.query(
    `
    SELECT *
    FROM positions
    WHERE status = 'CLOSED'
    ORDER BY id DESC
    LIMIT 3000
    `
  );

const trades =
  result.rows;

    /*
    ==================================================
    STRATEGY MEMORY
    ==================================================
    */

    const strategies = {};

    /*
    ==================================================
    BUILD STRATEGY PROFILES
    ==================================================
    */

    for (
      const trade of trades
    ) {

      /*
      ================================================
      STRATEGY SIGNATURE
      ================================================
      */

      const strategyKey =

        `${trade.regime || "UNKNOWN"}_` +

        `${trade.trend || "SIDEWAYS"}_` +

        `${trade.volatility_regime || "NORMAL"}_` +

        `${trade.momentum_state || "NEUTRAL"}_` +

        `${trade.decision || "HOLD"}`;

      /*
      ================================================
      INITIALIZE
      ================================================
      */

      if (
        !strategies[strategyKey]
      ) {

        strategies[strategyKey] = {

          wins: 0,

          losses: 0,

          totalPnL: 0,

          trades: 0,

          confidenceTotal: 0,
        };
      }

      /*
      ================================================
      UPDATE STATS
      ================================================
      */

      const strategy =
        strategies[strategyKey];

      strategy.trades++;

      strategy.totalPnL +=
        Number(
          trade.pnl || 0
        );

      strategy.confidenceTotal +=
        Number(
          trade.confidence || 0
        );

      if (
  Number(trade.pnl) > 0
) {

  strategy.wins++;
}

else if (
  Number(trade.pnl) < 0
) {

  strategy.losses++;
}
    }

    /*
    ==================================================
    STRATEGY EVOLUTION
    ==================================================
    */

    const evolvedStrategies = [];

    for (
      const strategyKey of
      Object.keys(strategies)
    ) {

      const stats =
        strategies[strategyKey];

      /*
      ================================================
      MINIMUM SAMPLE SIZE
      ================================================
      */

      if (
        stats.trades < 20
      ) {

        continue;
      }

      /*
      ================================================
      PERFORMANCE METRICS
      ================================================
      */

      const winRate =

        (
          stats.wins /
          stats.trades
        ) * 100;

      const avgPnL =

        stats.totalPnL /
        stats.trades;

      const avgConfidence =

        stats.confidenceTotal /
        stats.trades;

      /*
      ================================================
      EVOLUTION SCORE
      ================================================
      */

     let evolutionScore =

(
  winRate * 0.7
)

+

(
  avgPnL * 5
)

+

(
  avgConfidence * 0.1
);

evolutionScore =
  Number(
    evolutionScore.toFixed(2)
  );

      /*
      ================================================
      STRATEGY CLASSIFICATION
      ================================================
      */

     let classification =
  "NEUTRAL";

if (
  winRate >= 52 &&
  avgPnL > 0
) {
  classification = "PROMOTE";
}

else if (

  avgPnL < -1 ||

  (
    winRate < 40 &&
    avgPnL < 0
  )

) {

  classification = "SUPPRESS";
}

      /*
      ================================================
      STRATEGY PROFILE
      ================================================
      */

      evolvedStrategies.push({

        strategyKey,

        classification,

        trades:
          stats.trades,

        winRate:
          Number(
            winRate.toFixed(2)
          ),

        avgPnL:
          Number(
            avgPnL.toFixed(2)
          ),

        avgConfidence:
          Number(
            avgConfidence.toFixed(2)
          ),

        evolutionScore,
      });
    }

    /*
    ==================================================
    SORT BEST STRATEGIES
    ==================================================
    */

    evolvedStrategies.sort(
      (a, b) =>

        b.evolutionScore -
        a.evolutionScore
    );

    /*
    ==================================================
    TOP STRATEGIES
    ==================================================
    */

    const promotedStrategies =

      evolvedStrategies.filter(

        strategy =>

          strategy.classification ===
          "PROMOTE"
      );

    const suppressedStrategies =

      evolvedStrategies.filter(

        strategy =>

          strategy.classification ===
          "SUPPRESS"
      );

    /*
    ==================================================
    LOGGING
    ==================================================
    */

    console.log(`
==================================
AUTONOMOUS STRATEGY EVOLUTION
==================================
`);

    console.table(

      evolvedStrategies.slice(0, 15)
    );

    console.log(`
Promoted Strategies:
${promotedStrategies.length}

Suppressed Strategies:
${suppressedStrategies.length}

==================================
`);
const promotedCount =

  evolvedStrategies.filter(
    s =>
      s.classification ===
      "PROMOTE"
  ).length;

if (
  promotedCount === 0 &&
  evolvedStrategies.length > 0
) {

  evolvedStrategies[0]
    .classification =
      "PROMOTE";
}
    const analytics = {

    strategies: evolvedStrategies,

    promotedStrategies,

    suppressedStrategies,

};

cachedAnalytics = analytics;

cacheTimestamp = Date.now();

return analytics;

  } catch (err) {

    console.log(`
==================================
STRATEGY EVOLUTION ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

    return {

        strategies: [],

        promotedStrategies: [],

        suppressedStrategies: [],

    };

}
}
function clearStrategyAnalyticsCache() {

    cachedAnalytics = null;

    cacheTimestamp = 0;

}
module.exports = {

    analyzeStrategyPerformance,

    clearStrategyAnalyticsCache,

};
