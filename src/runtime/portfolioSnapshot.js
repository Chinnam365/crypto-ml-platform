function buildPortfolioSnapshot({

  equity,

  availableCapital,

  usedCapital,

  openPositions,

}) {

  return {

    equity,

    availableCapital,

    usedCapital,

    openPositions,

    timestamp:
      new Date()
        .toISOString(),
  };
}

module.exports = {
  buildPortfolioSnapshot,
};
