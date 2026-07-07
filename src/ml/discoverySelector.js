const {
  scanUniverse,
} = require("./universeScanner");
 
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

async function getDiscoveryCandidates(pool) {

  try {

    const marketData =
  await scanUniverse();

console.log(`
==================================
UNIVERSE SCANNER
==================================

Symbols Returned:
${marketData.length}

==================================
`);

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

        coin.quoteVolume > 1000000 &&

        coin.symbolScore >= 45 &&

        coin.classification !== "DISABLE" &&

        coin.shouldTrade

    )
    .sort(
      (a, b) =>
        b.fusionScore -
        a.fusionScore
    )
    .slice(0, 30);
console.log(`
==================================
DISCOVERY STATS
==================================

Market Symbols:
${marketData.length}

Ranked:
${discoveries.length}

Qualified:
${candidates.length}

==================================
`);
console.log(`
==================================
DISCOVERY CANDIDATES
==================================
`);

    candidates.forEach(
      coin => {

        console.log(
    `${coin.symbol}
 | Opportunity: ${coin.opportunityScore}
 | Fusion: ${coin.fusionScore}
 | Prediction: ${coin.predictionProbability}
 | Discovery: ${coin.discoveryScore}`
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
