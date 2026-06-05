const {
  getDiscoveryCandidates,
} = require(
  "../ml/discoverySelector"
);

const {
  evaluateDiscoveryCandidates,
} = require(
  "../ml/discoveryEvaluator"
);

const {
  rotateCapital,
} = require(
  "../ml/portfolioRotationEngine"
);

const {
  optimizePortfolio,
} = require(
  "../ml/portfolioOptimizer"
);

async function runAutonomousPipeline() {

  console.log(`
==================================
AUTONOMOUS PIPELINE START
==================================
`);

  const discoveries =
    await getDiscoveryCandidates();

  const evaluated =
    await evaluateDiscoveryCandidates(
      discoveries
    );

  const allocations =
    rotateCapital(
      evaluated
    );

  const optimized =
    optimizePortfolio(
      allocations
    );

  console.log(`
==================================
PIPELINE COMPLETE
==================================
Candidates:
${evaluated.length}
==================================
`);

  return {

    discoveries,

    evaluated,

    allocations,

    optimized,
  };
}

module.exports = {
  runAutonomousPipeline,
};
