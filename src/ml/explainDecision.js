function explainDecision({

  side,

  confidence,

  threshold,

  volatility,

  trend,

  regime,

  tradeQuality,

  multiTf,
}) {

  const reasons = [];

  // ==========================================
  // SIDE
  // ==========================================

  if (side === "HOLD") {

    reasons.push(
      "No strong directional signal"
    );
  }

  // ==========================================
  // CONFIDENCE
  // ==========================================

  if (
    confidence < threshold
  ) {

    reasons.push(
      "Confidence below adaptive threshold"
    );
  }

  else {

    reasons.push(
      "Confidence exceeded threshold"
    );
  }

  // ==========================================
  // VOLATILITY
  // ==========================================

  if (volatility < 0.4) {

    reasons.push(
      "Volatility too low"
    );
  }

  if (volatility > 7) {

    reasons.push(
      "Volatility extremely high"
    );
  }

  // ==========================================
  // MULTI TF
  // ==========================================

  if (

    multiTf.overallTrend ===
    trend

  ) {

    reasons.push(
      "Trend aligned across timeframes"
    );
  }

  else {

    reasons.push(
      "Timeframe trend conflict"
    );
  }

  // ==========================================
  // REGIME
  // ==========================================

  reasons.push(
    `Market regime: ${regime}`
  );

  // ==========================================
  // TRADE QUALITY
  // ==========================================

  if (tradeQuality >= 70) {

    reasons.push(
      "High quality setup"
    );
  }

  else if (tradeQuality >= 50) {

    reasons.push(
      "Moderate quality setup"
    );
  }

  else {

    reasons.push(
      "Low quality setup"
    );
  }

  return reasons;
}

module.exports = {
  explainDecision,
};
