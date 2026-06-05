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

async function runDiscoveryCycle() {

  const candidates =
    await getDiscoveryCandidates();

  const evaluated =
    await evaluateDiscoveryCandidates(
      candidates
    );

  return evaluated;
}

module.exports = {
  runDiscoveryCycle,
};
