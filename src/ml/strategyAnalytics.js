const pool =
  require("../db/db");

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
        stats.trades < 10
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
          winRate * 0.5
        )

        +

        (
          avgPnL * 15
        )

        +

        (
          avgConfidence * 0.2
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
        evolutionScore >= 75
      ) {

        classification =
          "PROMOTE";
      }

      else if (
        evolutionScore <= 40
      ) {

        classification =
          "SUPPRESS";
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

    return {

      strategies:
        evolvedStrategies,

      promotedStrategies,

      suppressedStrategies,
    };

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

module.exports = {
  analyzeStrategyPerformance,
};
