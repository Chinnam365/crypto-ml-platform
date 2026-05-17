function getAdaptiveThreshold({

  regime,

  volatility,

  drawdownState,

  symbolWeight,
}) {

  let threshold = 60;

  // ==========================================
  // REGIME ADJUSTMENTS
  // ==========================================

  if (
    regime === "TRENDING"
  ) {

    threshold -= 5;
  }

  if (
    regime === "SIDEWAYS"
  ) {

    threshold += 0;
  }

  // ==========================================
  // VOLATILITY ADJUSTMENTS
  // ==========================================

  if (volatility > 4) {

    threshold += 10;
  }

  if (volatility < 1.5) {

    threshold -= 5;
  }

  // ==========================================
  // DRAWDOWN RISK MODES
  // ==========================================

  if (
    drawdownState.riskMode ===
    "DEFENSIVE"
  ) {

    threshold += 5;
  }

  if (
    drawdownState.riskMode ===
    "PROTECTIVE"
  ) {

    threshold += 10;
  }

  // ==========================================
  // SYMBOL PERFORMANCE
  // ==========================================

  if (symbolWeight > 1.2) {

    threshold -= 5;
  }

  if (symbolWeight < 0.8) {

    threshold += 5;
  }

  return threshold;
}

module.exports = {
  getAdaptiveThreshold,
};
