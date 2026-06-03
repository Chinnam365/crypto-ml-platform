const {
  generateFeatures,
} = require(
  "../features/featureExtractor"
);

async function evaluateDiscoveryCandidates(
  candidates
) {

  const evaluated = [];

  for (
    const candidate of candidates
  ) {

    try {

      const features =
        await generateFeatures(
          candidate.symbol
        );

      if (
        !features
      ) {

        continue;
      }

      evaluated.push({

        symbol:
          candidate.symbol,

        discoveryScore:
          candidate.discoveryScore,

        confidence:
          features.confidence,

        decision:
          features.decision,

        marketState:
          features.marketState,

        finalScore:
          Number(
            (
              candidate.discoveryScore +
              features.confidence
            ).toFixed(2)
          ),
      });

    } catch (err) {

      console.log(
        `Discovery evaluation failed: ${candidate.symbol}`
      );
    }
  }

  return evaluated.sort(
    (a, b) =>
      b.finalScore -
      a.finalScore
  );
}

module.exports = {
  evaluateDiscoveryCandidates,
};
