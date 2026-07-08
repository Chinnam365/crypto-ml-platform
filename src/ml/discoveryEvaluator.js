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

     
let features =
    await generateFeatures(
        candidate.symbol
    );

/*
==================================================
FEATURE VALIDATION
==================================================
*/

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

const confidence =
    Number(features.confidence);

const finalScore =
    Number(
        (
            Number(candidate.discoveryScore || 0) +
            (Number.isFinite(confidence) ? confidence : 0)
        ).toFixed(2)
    );

evaluated.push({

    symbol: candidate.symbol,

    discoveryScore:
        Number(candidate.discoveryScore || 0),

    confidence:
        Number.isFinite(confidence)
            ? confidence
            : 0,

    decision:
        features.decision || "HOLD",

    marketState:
        features.marketState || "UNKNOWN",

    finalScore,

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
