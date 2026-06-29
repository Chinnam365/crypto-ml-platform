/*
==================================================
OPPORTUNITY INTELLIGENCE
PART 1
==================================================
*/

const {
  getMarketScanner,
} = require("./marketScanner");

const {
  getSymbolIntelligence,
} = require("./symbolIntelligence");

/*
==================================================
HELPERS
==================================================
*/

function clamp(value, min = 0, max = 100) {

  return Math.max(
    min,
    Math.min(
      max,
      Number(value || 0)
    )
  );

}

function round(value) {

  return Number(
    Number(value || 0).toFixed(2)
  );

}

/*
==================================================
VOLUME SCORE
==================================================
*/

function calculateVolumeScore(pair) {

  let score = 0;

  if (pair.quoteVolume >= 100000000)
    score = 100;

  else if (pair.quoteVolume >= 50000000)
    score = 90;

  else if (pair.quoteVolume >= 20000000)
    score = 80;

  else if (pair.quoteVolume >= 10000000)
    score = 70;

  else if (pair.quoteVolume >= 5000000)
    score = 60;

  else if (pair.quoteVolume >= 1000000)
    score = 50;

  else
    score = 30;

  return score;

}

/*
==================================================
ACTIVITY SCORE
==================================================
*/

function calculateActivityScore(pair) {

  let score = 0;

  if (pair.trades >= 500000)
    score = 100;

  else if (pair.trades >= 250000)
    score = 90;

  else if (pair.trades >= 100000)
    score = 80;

  else if (pair.trades >= 50000)
    score = 70;

  else if (pair.trades >= 20000)
    score = 60;

  else if (pair.trades >= 10000)
    score = 50;

  else
    score = 35;

  return score;

}

/*
==================================================
MOMENTUM SCORE
==================================================
*/

function calculateMomentumScore(pair) {

  const change =
    Number(
      pair.priceChange || 0
    );

  if (change >= 15)
    return 100;

  if (change >= 10)
    return 90;

  if (change >= 7)
    return 80;

  if (change >= 5)
    return 70;

  if (change >= 3)
    return 60;

  if (change >= 1)
    return 55;

  if (change >= -1)
    return 50;

  if (change >= -3)
    return 40;

  if (change >= -5)
    return 30;

  return 20;

}

/*
==================================================
VOLATILITY SCORE
==================================================
*/

function calculateVolatilityScore(pair) {

  const volatility =
    Math.abs(
      Number(
        pair.priceChange || 0
      )
    );

  if (volatility >= 20)
    return 100;

  if (volatility >= 15)
    return 90;

  if (volatility >= 10)
    return 80;

  if (volatility >= 7)
    return 70;

  if (volatility >= 5)
    return 60;

  if (volatility >= 3)
    return 50;

  return 40;

}

/*
==================================================
SYMBOL MAP
==================================================
*/

function buildSymbolMap(symbols) {

  const map = {};

  for (const item of symbols) {

    map[item.symbol] = item;

  }

  return map;

}

/*
==================================================
OPPORTUNITY ENGINE
==================================================
*/

async function getOpportunityIntelligence(pool) {

  const market =
    await getMarketScanner();

  const symbolStats =
    await getSymbolIntelligence(pool);

  const symbolMap =
    buildSymbolMap(symbolStats);

  const opportunities = [];

  for (const pair of market) {

    const intelligence =
      symbolMap[pair.symbol] || {};

    const volumeScore =
      calculateVolumeScore(pair);

    const activityScore =
      calculateActivityScore(pair);

    const momentumScore =
      calculateMomentumScore(pair);

    const volatilityScore =
      calculateVolatilityScore(pair);

    const symbolScore =
      Number(
        intelligence.score || 50
      );

    const opportunityScore =
      round(

        volumeScore * 0.25 +

        activityScore * 0.20 +

        momentumScore * 0.20 +

        volatilityScore * 0.15 +

        symbolScore * 0.20

      );

    opportunities.push({

      symbol:
        pair.symbol,

      price:
        pair.price,

      volume:
        pair.volume,

      quoteVolume:
        pair.quoteVolume,

      trades:
        pair.trades,

      priceChange:
        pair.priceChange,

      volumeScore,

      activityScore,

      momentumScore,

      volatilityScore,

      symbolScore,

      opportunityScore,

      classification:
        opportunityScore >= 85
          ? "STRONG_BUY"
          : opportunityScore >= 70
          ? "WATCH"
          : opportunityScore >= 50
          ? "NEUTRAL"
          : "IGNORE"

    });

  }

  opportunities.sort(

    (a, b) =>

      b.opportunityScore -

      a.opportunityScore

  );

  opportunities.forEach(

    (item, index) => {

      item.rank =
        index + 1;

    }

  );

  return opportunities;

}
/*
==================================================
FILTERING
==================================================
*/

  const filteredOpportunities = opportunities.filter(item => {

    if (
      item.quoteVolume < 1000000
    )
      return false;

    if (
      item.trades < 5000
    )
      return false;

    return true;

  });

/*
==================================================
TOP OPPORTUNITIES
==================================================
*/

function getTopOpportunities(
  opportunities,
  limit = 20
) {

  return opportunities
    .slice(0, limit);

}

/*
==================================================
STRONG BUY
==================================================
*/

function getStrongBuySignals(
  opportunities
) {

  return opportunities.filter(item =>

    item.classification ===
    "STRONG_BUY"

  );

}

/*
==================================================
WATCHLIST
==================================================
*/

function getWatchList(
  opportunities
) {

  return opportunities.filter(item =>

    item.classification ===
    "WATCH"

  );

}

/*
==================================================
SUMMARY
==================================================
*/

const summary = {

  scannedSymbols:
    market.length,

  qualifiedSymbols:
    filteredOpportunities.length,

  strongBuys:

    filteredOpportunities.filter(

      x =>

        x.classification ===
        "STRONG_BUY"

    ).length,

  watchList:

    filteredOpportunities.filter(

      x =>

        x.classification ===
        "WATCH"

    ).length,

  ignored:

    filteredOpportunities.filter(

      x =>

        x.classification ===
        "IGNORE"

    ).length

};

/*
==================================================
RETURN
==================================================
*/

return {

  success: true,

  timestamp:

    new Date().toISOString(),

  summary,

  topOpportunities:

    getTopOpportunities(
      filteredOpportunities,
      20
    ),

  strongBuy:

    getStrongBuySignals(
      filteredOpportunities
    ),

  watchList:

    getWatchList(
      filteredOpportunities
    )

};

}

/*
==================================================
EXPORTS
==================================================
*/

module.exports = {

  getOpportunityIntelligence

};

/*
==================================================
END OF FILE
==================================================
*/
