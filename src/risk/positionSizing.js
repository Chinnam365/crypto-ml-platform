function calculatePositionSize(
  features
) {

  try {

    const {

      confidence,

      volatilityRegime,

      signalQuality,

      explorationTrade = false,

    } = features;

    /*
    ==================================================
    BASE POSITION SIZE
    ==================================================
    */

    let positionSize = 1;

    /*
    ==================================================
    CONFIDENCE SCALING
    ==================================================
    */

    if (
      confidence >= 80
    ) {

      positionSize += 2;
    }

    else if (
      confidence >= 60
    ) {

      positionSize += 1;
    }

    /*
    ==================================================
    SIGNAL QUALITY BONUS
    ==================================================
    */

    if (
      signalQuality ===
      "HIGH"
    ) {

      positionSize += 1;
    }

    /*
    ==================================================
    HIGH VOLATILITY REDUCTION
    ==================================================
    */

    if (
      volatilityRegime ===
      "HIGH"
    ) {

      positionSize -= 1;
    }

    /*
    ==================================================
    EXPLORATION TRADE REDUCTION
    ==================================================
    */

    if (
      explorationTrade
    ) {

      positionSize =
        positionSize * 0.25;
    }

    /*
    ==================================================
    MIN/MAX LIMITS
    ==================================================
    */

    positionSize =
      Math.max(

        0.5,

        Math.min(
          positionSize,
          5
        )
      );

    return {

      recommendedPositionSize:
        Number(
          positionSize.toFixed(2)
        ),
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
