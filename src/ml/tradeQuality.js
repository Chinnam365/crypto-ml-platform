function calculateTradeQuality({

  confidence,

  regime,

  trend,

  volatility,

  multiTf,
}) {

  let score = 50;

  // ==========================================
  // CONFIDENCE
  // ==========================================

  if (confidence > 80) {

    score += 20;
  }

  else if (confidence > 70) {

    score += 10;
  }

  // ==========================================
  // TREND ALIGNMENT
  // ==========================================

  if (

    multiTf.overallTrend ===
    trend

  ) {

    score += 15;
  }

  // ==========================================
  // REGIME
  // ==========================================

  if (
    regime === "TRENDING"
  ) {

    score += 10;
  }

  // ==========================================
  // VOLATILITY
  // ==========================================

  if (

    volatility > 1 &&

    volatility < 4

  ) {

    score += 10;
  }

  // ==========================================
  // PENALIZE EXTREME VOLATILITY
  // ==========================================

  if (volatility > 7) {

    score -= 20;
  }

  return Math.max(
    0,
    Math.min(score, 100)
  );
}

module.exports = {
  calculateTradeQuality,
};
