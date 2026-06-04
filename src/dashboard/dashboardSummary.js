async function getDashboardSummary({

  equity,

  availableCapital,

  openPositions,

  dailyPnL,

}) {

  return {

    equity,

    availableCapital,

    openPositions,

    dailyPnL,

    timestamp:
      new Date()
        .toISOString(),
  };
}

module.exports = {
  getDashboardSummary,
};
