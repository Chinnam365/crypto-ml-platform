const {
  getMarketScanner,
} = require("./marketScanner");

const {
  rankDiscoveries,
} = require("./discoveryRanking");

const {
  getSymbolIntelligence,
} = require("./symbolIntelligence");

const {
  evaluateOpportunity,
} = require("./opportunityIntelligenceV2");

const {
  fuseOpportunity,
} = require("./opportunityFusionEngine");

const {
  predictOpportunity,
} = require("./opportunityPredictionEngine");

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
  ).map(coin => {

    const opportunity =
      evaluateOpportunity(
        coin
      );

    const fusion =
      fuseOpportunity({

        opportunity,

        symbolScore:
          scoreMap[
            coin.symbol
          ]?.score || 50,

        confidence: 50,

        discovery:
          coin.discoveryScore || 50,

        reinforcement: 50,

        portfolio: 50,

      });

    const prediction =
      predictOpportunity({

        fusionScore:
          fusion.finalScore,

        liquidity:
          opportunity.liquidity,

        momentum:
          opportunity.momentum,

        volatility:
          opportunity.volatility,

        confidence: 50,

        discovery:
          coin.discoveryScore || 50,

        reinforcement: 50,

        trend:
          coin.priceChange > 0
            ? "BULLISH"
            : "BEARISH"

      });

    return {

      ...coin,

      symbolScore:
        scoreMap[
          coin.symbol
        ]?.score || 50,

      classification:
        scoreMap[
          coin.symbol
        ]?.classification ||
        "NEUTRAL",

      opportunityScore:
        opportunity.opportunityScore,

      opportunityClassification:
        opportunity.classification,

      opportunityReasons:
        opportunity.reasons,

      fusionScore:
        fusion.finalScore,

      predictionProbability:
        prediction.probability,

      shouldTrade:
        prediction.shouldTrade

    };

});

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
       .sort(

  (a, b) =>

    b.fusionScore -

    a.fusionScore

)

.slice(0,10)

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
