function detectMarketRegime(
  features
) {

  try {

    const {

      rsi,

      emaDistance,

      trend,

    } = features;

    // =========================
    // VOLATILE CONDITIONS
    // =========================

    if (
      Math.abs(
        emaDistance
      ) > 2
    ) {

      return "VOLATILE";
    }

    // =========================
    // STRONG BULLISH
    // =========================

    if (
      trend === "BULLISH" &&
      rsi > 60
    ) {

      return "BULLISH";
    }

    // =========================
    // STRONG BEARISH
    // =========================

    if (
      trend === "BEARISH" &&
      rsi < 40
    ) {

      return "BEARISH";
    }

    // =========================
    // OTHERWISE SIDEWAYS
    // =========================

    return "SIDEWAYS";

  } catch (err) {

    console.error(

      "Regime Error:",

      err.message
    );

    return "UNKNOWN";
  }
}

module.exports = {
  detectMarketRegime,
};
