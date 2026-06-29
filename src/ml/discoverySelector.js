const {
  getMarketScanner,
} = require("./marketScanner");

const {
  rankDiscoveries,
} = require("./discoveryRanking");

const {
  getSymbolIntelligence,
} = require("./symbolIntelligence");

async function getDiscoveryCandidates() {

  try {

    const marketData =
  await getMarketScanner();

const symbolScores =
  await getSymbolIntelligence(pool);

const scoreMap =
  {};

for (
  const symbol of symbolScores
) {

  scoreMap[
    symbol.symbol
  ] = symbol;

}

   const discoveries =
  rankDiscoveries(
    marketData
  ).map(coin => ({

    ...coin,

    symbolScore:

      scoreMap[
        coin.symbol
      ]?.score || 50,

    classification:

      scoreMap[
        coin.symbol
      ]?.classification ||

      "NEUTRAL"

  }));

    const candidates =
      discoveries
        .filter(

  coin =>

    coin.quoteVolume >
      1000000 &&

    coin.symbolScore >=
      45 &&

    coin.classification !==
      "DISABLE"

)
        .slice(0, 10);

    console.log(`
==================================
DISCOVERY CANDIDATES
==================================
`);

    candidates.forEach(
      coin => {

        console.log(
          coin.symbol,
          "| Score:",
          coin.discoveryScore,
          "| Change:",
          coin.priceChange
        );
      }
    );

    console.log(`
==================================
`);

    return candidates;

  } catch (err) {

    console.log(
      "Discovery Selector Error:",
      err.message
    );

    return [];
  }
}

module.exports = {
  getDiscoveryCandidates,
};
