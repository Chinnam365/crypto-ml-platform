function canRiskTrade({

  drawdown,

  riskLevel,

}) {

  if (
    drawdown > 20
  ) {

    return false;
  }

  if (
    riskLevel ===
    "HIGH"
  ) {

    return false;
  }

  return true;
}

module.exports = {
  canRiskTrade,
};
