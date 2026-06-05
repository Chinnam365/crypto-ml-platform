const {
  processTradeOutcome,
} = require(
  "../integration/learningCoordinator"
);

async function processLearning(
  trade
) {

  return processTradeOutcome(
    trade
  );
}

module.exports = {
  processLearning,
};
