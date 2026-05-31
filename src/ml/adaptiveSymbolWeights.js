const pool =
  require("../db/db");

/*
==================================================
ADAPTIVE SYMBOL INTELLIGENCE
==================================================
*/

async function getAdaptiveSymbolWeights() {

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
LIMIT 2000
        `
      );

    const trades =
      result.rows;

    /*
    ==================================================
    DEFAULT SYMBOLS
    ==================================================
    */

    const symbolStats = {

      BTCUSDT: {
        wins: 0,
        total: 0,
        pnl: 0,
      },

      ETHUSDT: {
        wins: 0,
        total: 0,
        pnl: 0,
      },

      SOLUSDT: {
        wins: 0,
        total: 0,
        pnl: 0,
      },

      LINKUSDT: {
        wins: 0,
        total: 0,
        pnl: 0,
      },

      DOGEUSDT: {
        wins: 0,
        total: 0,
        pnl: 0,
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

      if (
        !symbolStats[
          trade.symbol
        ]
      ) {

        symbolStats[
          trade.symbol
        ] = {

          wins: 0,
          total: 0,
          pnl: 0,
        };
      }

      symbolStats[
        trade.symbol
      ].total++;

      symbolStats[
        trade.symbol
      ].pnl +=
        Number(
          trade.pnl || 0
        );

      if (
        trade.outcome === "WIN"
      ) {

        symbolStats[
          trade.symbol
        ].wins++;
      }
    }

    /*
    ==================================================
    CALCULATE WEIGHTS
    ==================================================
    */

    const weights = {};

    for (
      const symbol of
      Object.keys(symbolStats)
    ) {

      const stats =
        symbolStats[symbol];

      /*
      ================================================
      MINIMUM SAMPLE SIZE
      ================================================
      */

      if (
        stats.total < 5
      ) {

        weights[symbol] = 1;

        continue;
      }

      /*
      ================================================
      WIN RATE
      ================================================
      */

      const winRate =

        stats.wins /
        stats.total;

      /*
      ================================================
      AVG PNL
      ================================================
      */

      const avgPnL =

        stats.pnl /
        stats.total;

      /*
      ================================================
      WEIGHT FORMULA
      ================================================
      */

      let weight =

        0.5 +

        (winRate * 1.2) +

        (avgPnL * 0.15);

      /*
      ================================================
      CLAMPING
      ================================================
      */

      weight =

        Math.max(
          0.4,
          Math.min(
            weight,
            2.5
          )
        );

      weights[symbol] =
        Number(
          weight.toFixed(2)
        );
    }

    /*
    ==================================================
    SYMBOL RANKING
    ==================================================
    */

    const rankings =

      Object.keys(weights)

        .map(symbol => ({

          symbol,

          weight:
            weights[symbol],

          trades:
            symbolStats[symbol]
              .total,

          avgPnL:
            Number(

              (
                symbolStats[symbol]
                  .pnl

                /

                Math.max(
                  1,
                  symbolStats[symbol]
                    .total
                )

              ).toFixed(2)
            ),
        }))

        .sort(
          (a, b) =>
            b.weight -
            a.weight
        );

    /*
    ==================================================
    LOGGING
    ==================================================
    */

    console.log(`
==================================
ADAPTIVE SYMBOL WEIGHTS
==================================
`);

    console.table(rankings);

    console.log(`
==================================
`);

    return {

      weights,

      rankings,
    };

  } catch (err) {

    console.log(`
==================================
SYMBOL WEIGHT ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

    return {

      weights: {},

      rankings: [],
    };
  }
}

module.exports = {
  getAdaptiveSymbolWeights,
};
