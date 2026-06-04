function createDecisionFeed(
  decisions
) {

  return decisions
    .slice(-100)
    .reverse();
}

module.exports = {
  createDecisionFeed,
};
