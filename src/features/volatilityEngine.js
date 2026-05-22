function calculateVolatility(
  candles
) {

  try {

    if (
      candles.length < 2
    ) {

      return null;
    }

    // =========================
    // PERCENT MOVEMENTS
    // =========================

    const movements = [];

    for (
      let i = 1;
      i < candles.length;
      i++
    ) {

      const previousClose =
        Number(
          candles[i - 1].close
        );

      const currentClose =
        Number(
          candles[i].close
        );

      const movement =
        Math.abs(

          (
            (
              currentClose -
              previousClose
            ) /

            previousClose
          ) * 100
        );

      movements.push(
        movement
      );
    }

    // =========================
    // AVERAGE VOLATILITY
    // =========================

    const averageVolatility =

      movements.reduce(
        (
          sum,
          value
        ) => sum + value,
        0
      ) /

      movements.length;

    // =========================
    // VOLATILITY REGIME
    // =========================

    let volatilityRegime =
      "LOW";

    if (
      averageVolatility >
      1
    ) {

      volatilityRegime =
        "HIGH";

    } else if (
      averageVolatility >
      0.4
    ) {

      volatilityRegime =
        "MEDIUM";
    }

    return {

      volatility:
        Number(
          averageVolatility.toFixed(4)
        ),

      volatilityRegime,
    };

  } catch (err) {

    console.error(

      "Volatility Error:",

      err.message
    );

    return null;
  }
}

module.exports = {
  calculateVolatility,
};
