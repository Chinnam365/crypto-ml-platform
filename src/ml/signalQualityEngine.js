function calculateSignalQuality(
  features
) {

  try {

    let confidence = 50;

    const {

      rsi,

      trend,

      regime,

      volatilityRegime,

      emaDistance,

    } = features;

    // =========================
    // TREND ALIGNMENT
    // =========================

    if (
      trend === "BULLISH"
    ) {

      confidence += 10;
    }

    if (
      trend === "BEARISH"
    ) {

      confidence += 10;
    }

    // =========================
    // STRONG RSI CONDITIONS
    // =========================

    if (
      rsi > 60 ||
      rsi < 40
    ) {

      confidence += 15;
    }

    // =========================
    // SIDEWAYS PENALTY
    // =========================

    if (
      regime === "SIDEWAYS"
    ) {

      confidence -= 10;
    }

    // =========================
    // VOLATILITY PENALTY
    // =========================

    if (
      volatilityRegime ===
      "HIGH"
    ) {

      confidence -= 15;
    }

    // =========================
    // EMA DISTANCE BONUS
    // =========================

    if (
      Math.abs(
        emaDistance
      ) > 0.3
    ) {

      confidence += 10;
    }

    // =========================
    // LIMIT RANGE
    // =========================

    confidence =
      Math.max(
        0,
        Math.min(
          confidence,
          100
        )
      );

    // =========================
    // QUALITY LABEL
    // =========================

    let quality =
      "LOW";

    if (
      confidence >= 75
    ) {

      quality =
        "HIGH";

    } else if (
      confidence >= 60
    ) {

      quality =
        "MEDIUM";
    }

    return {

      confidence,

      quality,
    };

  } catch (err) {

    console.error(

      "Signal Quality Error:",

      err.message
    );

    return {

      confidence: 0,

      quality:
        "UNKNOWN",
    };
  }
}

module.exports = {
  calculateSignalQuality,
};
