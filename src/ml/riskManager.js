const {
  MAX_RISK_PERCENT,
  HIGH_VOLATILITY_THRESHOLD,
  MAX_POSITION_SIZE_MULTIPLIER,
  MIN_POSITION_SIZE_MULTIPLIER,
} = require("../config/riskConfig");

function calculatePositionSize({
  balance,
  confidence,
  volatility,
  entryPrice,
  stopLoss,
}) {
  const stopDistance = Math.abs(
    entryPrice - stopLoss
  );

  if (stopDistance <= 0) {
    return 0;
  }

  const dollarRisk =
    balance * MAX_RISK_PERCENT;

  let positionSize =
    dollarRisk / stopDistance;

  let confidenceMultiplier = confidence / 100;

  if (
    confidenceMultiplier >
    MAX_POSITION_SIZE_MULTIPLIER
  ) {
    confidenceMultiplier =
      MAX_POSITION_SIZE_MULTIPLIER;
  }

  if (
    confidenceMultiplier <
    MIN_POSITION_SIZE_MULTIPLIER
  ) {
    confidenceMultiplier =
      MIN_POSITION_SIZE_MULTIPLIER;
  }

  positionSize *= confidenceMultiplier;

  if (
    volatility >= HIGH_VOLATILITY_THRESHOLD
  ) {
    positionSize *= 0.5;
  }

  return Number(positionSize.toFixed(6));
}

module.exports = {
  calculatePositionSize,
};
