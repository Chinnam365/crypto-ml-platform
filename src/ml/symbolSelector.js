const {
  getAdaptiveSymbolWeights,
} = require("./adaptiveSymbolWeights");
const {
  generateSymbolRankings,
} = require("./symbolRankingEngine");
const pool =
  require("../db/db");

/*
==================================================
SYMBOL SELECTION ENGINE
==================================================
*/

async function selectTradingSymbols(
  {
    maxSymbols = 5,
  } = {}
) {

  try {

    /*
    ==================================================
    LOAD SYMBOL INTELLIGENCE
    ==================================================
    */

    const symbolData =
      await getAdaptiveSymbolWeights();

    const rankings =
      symbolData.rankings;
/*
==================================
PHASE 3 SYMBOL RANKINGS
==================================
*/

const rankingData =
  await generateSymbolRankings();

const suppressedSymbols =

  rankingData.rankings

    .filter(
      item =>
        item.classification ===
        "SUPPRESSED"
    )

    .map(
      item => item.symbol
    );
    /*
    ==================================================
    NO DATA YET
    ==================================================
    */

    if (rankings.length === 0) {

  console.log(`
==================================
NO SYMBOL HISTORY
==================================

Using Discovery Selector

==================================
`);

  const discoveries =
    await getDiscoveryCandidates(pool);

  return discoveries
    .slice(0, maxSymbols)
    .map(item => item.symbol);

}

    /*
    ==================================================
    ACTIVE MARKET FILTER
    ==================================================
    */

    const activeSymbols = [];

    for (
  const item of rankings
){
/*
==================================
SYMBOL SUPPRESSION
==================================
*/

if (
  suppressedSymbols.includes(
    item.symbol
  )
) {

  continue;
}

/*
==================================
WEIGHT-BASED DISABLE
==================================
*/

if (
  item.weight <= 0.05
) {

  console.log(`
==================================
SYMBOL DISABLED
==================================

Symbol:
${item.symbol}

Weight:
${item.weight}

==================================
`);

  continue;
}

try {

        /*
        ================================================
        RECENT ACTIVITY
        ================================================
        */

        const marketResult =
          await pool.query(

            `
            SELECT *

            FROM market_candles

            WHERE symbol = $1

            ORDER BY candle_time DESC

            LIMIT 20
            `,

            [item.symbol]
          );

        const candles =
          marketResult.rows;

        if (
          candles.length < 10
        ) {

          continue;
        }

        /*
        ================================================
        VOLUME CHECK
        ================================================
        */

        let avgVolume = 0;

        for (
          const candle of candles
        ) {

          avgVolume +=
            Number(
              candle.volume || 0
            );
        }

        avgVolume /= candles.length;

        /*
        ================================================
        LOW LIQUIDITY FILTER
        ================================================
        */

        if (
          avgVolume <= 0
        ) {

          continue;
        }

        /*
        ================================================
        FINAL SCORE
        ================================================
        */

        const score =

          item.weight *

          Math.log(
            avgVolume + 1
          );

        activeSymbols.push({

          symbol:
            item.symbol,

          score:
            Number(
              score.toFixed(2)
            ),

          weight:
            item.weight,

          avgPnL:
            item.avgPnL,

          trades:
            item.trades,

          avgVolume:
            Number(
              avgVolume.toFixed(2)
            ),
        });

      } catch (symbolErr) {

        console.log(`
==================================
SYMBOL FILTER ERROR
==================================
`);

        console.log(symbolErr);

        console.log(`
==================================
`);
      }
    }

    /*
    ==================================================
    SORT BEST SYMBOLS
    ==================================================
    */

    activeSymbols.sort(
      (a, b) =>
        b.score - a.score
    );

    /*
    ==================================================
    FINAL SELECTION
    ==================================================
    */

    const selected =

      activeSymbols

        .slice(0, maxSymbols)

        .map(
          item => item.symbol
        );

    /*
    ==================================================
    LOGGING
    ==================================================
    */
console.log(`
==================================
SUPPRESSED SYMBOLS
==================================
`);

console.table(
  suppressedSymbols
);

console.log(`
==================================
`);
    console.log(`
==================================
SYMBOL SELECTION ENGINE
==================================
`);

    console.table(activeSymbols);

    console.log(`
Selected Symbols:
${selected.join(", ")}

==================================
`);

    return selected;

  } catch (err) {

    console.log(`
==================================
SYMBOL SELECTION ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

    const discoveries =
  await getDiscoveryCandidates(pool);

return discoveries
  .slice(0, maxSymbols)
  .map(item => item.symbol);
  }
}

/*
==================================================
BACKWARD COMPATIBILITY
==================================================
*/

async function getBestSymbols(
  options = {}
) {

  return await selectTradingSymbols(
    options || {}
  );
}

module.exports = {

  selectTradingSymbols,

  getBestSymbols,
};
