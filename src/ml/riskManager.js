function calculatePositionSize({

  equity,

  riskPercent,

  entryPrice,

  stopLoss,
}) {

  // ==========================================
  // SAFE INPUTS
  // ==========================================

  const safeEquity =
    Number(equity || 0);

  const safeRiskPercent =
    Number(riskPercent || 0);

  const safeEntry =
    Number(entryPrice || 0);

  const safeStop =
    Number(stopLoss || 0);

  // ==========================================
  // VALIDATION
  // ==========================================

  if (

    isNaN(safeEquity) ||

    isNaN(safeRiskPercent) ||

    isNaN(safeEntry) ||

    isNaN(safeStop)

  ) {

    return 0;
  }

  // ==========================================
  // STOP DISTANCE
  // ==========================================

  const stopDistance =
    Math.abs(
      safeEntry - safeStop
    );

  // ==========================================
  // PROTECT AGAINST ZERO
  // ==========================================

  if (
    stopDistance <= 0
  ) {

    return 0;
  }

  // ==========================================
  // RISK AMOUNT
  // ==========================================

  const riskAmount =
    safeEquity *
    (safeRiskPercent / 100);

  // ==========================================
  // POSITION SIZE
  // ==========================================

  const positionSize =
    riskAmount /
    stopDistance;

  // ==========================================
  // FINAL SAFETY
  // ==========================================

  if (
    isNaN(positionSize) ||
    !isFinite(positionSize)
  ) {

    return 0;
  }

  // ==========================================
// MAX POSITION CAP
// ==========================================

const maxPositionSize =
  safeEquity * 0.05;

// ==========================================
// APPLY CAP
// ==========================================

const finalSize =
  Math.min(
    positionSize,
    maxPositionSize
  );

return Number(
  finalSize.toFixed(6)
);
}

module.exports = {
  calculatePositionSize,
};
