async function getRiskStatus({

  equity,

  usedCapital,

  drawdown,

  openPositions,

}) {

  let riskLevel =
    "LOW";

  if (
    drawdown > 10
  ) {

    riskLevel =
      "MEDIUM";
  }

  if (
    drawdown > 20
  ) {

    riskLevel =
      "HIGH";
  }

  return {

    equity,

    usedCapital,

    drawdown,

    openPositions,

    riskLevel,

    timestamp:
      new Date()
        .toISOString(),
  };
}

module.exports = {
  getRiskStatus,
};
