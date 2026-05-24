function calculatePositionSize(
  features
) {

  try {

    const {

      confidence,

      volatilityRegime,

      signalQuality,

    } = features;

    // =========================
    // BASE POSITION %
    // =========================

    let positionSize = 1;

    // =========================
    // CONFIDENCE SCALING
    // =========================

    if (
      confidence >= 80
    ) {

      positionSize += 2;

    } else if (
      confidence >= 60
    ) {

      positionSize += 1;
    }

    // =========================
    // SIGNAL QUALITY BONUS
    // =========================

    if (
      signalQuality ===
      "HIGH"
    ) {

      positionSize += 1;
    }

    // =========================
    // HIGH VOLATILITY REDUCTION
    // =========================

    if (
      volatilityRegime ===
      "HIGH"
    ) {

      positionSize -= 1;
    }

    // =========================
    // MIN/MAX LIMITS
    // =========================

    positionSize =
      Math.max(
        1,
        Math.min(
          positionSize,
          5
        )
      );

    return {

      recommendedPositionSize:
        positionSize,
    };

  } catch (err) {

    console.error(

      "Position Sizing Error:",

      err.message
    );

    return {

      recommendedPositionSize: 1,
    };
  }
}

module.exports = {
  calculatePositionSize,
};
