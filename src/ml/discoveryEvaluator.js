const {
  generateFeatures,
} = require(
  "../features/featureExtractor"
);

async function evaluateDiscoveryCandidates(
  candidates
) {
console.log(`
==================================
DISCOVERY EVALUATOR STARTED
==================================
Candidates:
${candidates.length}
==================================
`);
  const evaluated = [];

  for (
    const candidate of candidates
  ) {
console.log(
  "Evaluating:",
  candidate.symbol
);
    try {

      console.log(
  "BEFORE FEATURES:",
  candidate.symbol
);

console.log(
  "BEFORE FEATURES:",
  candidate.symbol
);

      const {
  loadDiscoveryHistory,
} = require(
  "./discoveryHistoryLoader"
);
      
let features =
  await generateFeatures(
    candidate.symbol
  );

if (!features) {

  console.log(
    `Loading history for ${candidate.symbol}`
  );

  console.log(
  "AFTER FEATURES:",
  candidate.symbol
);

console.log(
  "FEATURE RESULT:",
  JSON.stringify(features)
);

console.log(
  "AFTER FEATURES:",
  candidate.symbol
);

console.log(
  JSON.stringify(
    features,
    null,
    2
  )
);

      if (!features) {

  console.log(`
==================================
DISCOVERY FEATURE FAILURE
==================================

Symbol:
${candidate.symbol}

Features:
${features}

==================================
`);

  continue;
}

      console.log(`
==================================
DISCOVERY AI RESULT
==================================

Symbol:
${candidate.symbol}

Decision:
${features.decision}

Confidence:
${features.confidence}

Market State:
${features.marketState}

==================================
`);
      
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

  console.log(`
==================================
DISCOVERY EVALUATION ERROR
==================================

Symbol:
${candidate.symbol}

Error:
${err.message}

Stack:
${err.stack}

==================================
`);
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
