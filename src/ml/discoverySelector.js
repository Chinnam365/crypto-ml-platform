const {
  getMarketScanner,
} = require("./marketScanner");

const {
  rankDiscoveries,
} = require("./discoveryRanking");

async function getDiscoveryCandidates() {

  try {

    const marketData =
      await getMarketScanner();

    const discoveries =
      rankDiscoveries(
        marketData
      );

    const candidates =
      discoveries
        .filter(
          coin =>
            coin.quoteVolume >
            1000000
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
