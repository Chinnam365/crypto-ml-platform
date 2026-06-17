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
console.log(`
==================================
SYMBOL WEIGHT DEBUG
==================================

Trades Loaded:
${trades.length}

==================================
`);
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
  confidence: 0,
  recentPnl: [],
},

ETHUSDT: {
  wins: 0,
  total: 0,
  pnl: 0,
  confidence: 0,
  recentPnl: [],
},

SOLUSDT: {
  wins: 0,
  total: 0,
  pnl: 0,
  confidence: 0,
  recentPnl: [],
},

LINKUSDT: {
  wins: 0,
  total: 0,
  pnl: 0,
  confidence: 0,
  recentPnl: [],
},

DOGEUSDT: {
  wins: 0,
  total: 0,
  pnl: 0,
  confidence: 0,
  recentPnl: [],
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
    confidence: 0,
    recentPnl: [],
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
symbolStats[
  trade.symbol
].confidence +=
  Number(
    trade.confidence || 0
  );
if (
  !symbolStats[
    trade.symbol
  ].recentPnl
) {
  symbolStats[
    trade.symbol
  ].recentPnl = [];
}
symbolStats[
  trade.symbol
].recentPnl.push(
  Number(
    trade.pnl || 0
  )
);
      if (
        Number(trade.pnl || 0) > 0
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
const avgConfidence =

  stats.confidence /
  stats.total;

const recentTrades =

  stats.recentPnl.slice(
    0,
    20
  );

const recentPnL =

  recentTrades.length

    ? recentTrades.reduce(
        (a, b) => a + b,
        0
      ) /
      recentTrades.length

    : 0;

const sampleQuality =

  Math.min(
    stats.total / 50,
    1
  );
      console.log(
  symbol,
  stats.total,
  stats.wins,
  stats.pnl
);
      /*
      ================================================
      WEIGHT FORMULA
      ================================================
      */

     let weight =

  0.30 +

  (winRate * 1.00) +

  (avgPnL * 0.10) +

  (avgConfidence / 100 * 0.40) +

  (recentPnL * 0.05) +

  (sampleQuality * 0.50);

     /*
===============================================
UNDERPERFORMANCE SUPPRESSION
===============================================
*/

if (
  avgPnL < -5 &&
  stats.total >= 20
) {

  weight = 0.05;
}

/*
===============================================
CLAMPING
===============================================
*/

weight =

  Math.max(
    0.05,
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
avgConfidence:
  Number(
    (
      symbolStats[symbol]
        .confidence /

      Math.max(
        1,
        symbolStats[symbol]
          .total
      )
    ).toFixed(2)
  ),
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
console.log(`
==================================
SYMBOL WEIGHT RESULT
==================================

Rankings:
${rankings.length}

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
