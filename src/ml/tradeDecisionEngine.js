function generateTradeDecision(
  features
) {

  try {

    const {

      trend,

      rsi,

      confidence,

      signalQuality,

      regime,

      volatilityRegime,

    } = features;

    // =========================
    // DEFAULT
    // =========================

    let action =
      "HOLD";

    // =========================
    // BUY CONDITIONS
    // =========================

    if (

      trend === "BULLISH" &&

      rsi > 55 &&

      confidence >= 60 &&

      signalQuality !==
        "LOW" &&

      volatilityRegime !==
        "HIGH"
    ) {

      action = "BUY";
    }

    // =========================
    // SELL CONDITIONS
    // =========================

    if (

      trend === "BEARISH" &&

      rsi < 45 &&

      confidence >= 60 &&

      signalQuality !==
        "LOW" &&

      volatilityRegime !==
        "HIGH"
    ) {

      action = "SELL";
    }

    // =========================
    // SIDEWAYS FILTER
    // =========================

    if (
      regime === "SIDEWAYS" &&
      confidence < 70
    ) {

      action = "HOLD";
    }

    return {

      action,
    };

  } catch (err) {

    console.error(

      "Decision Engine Error:",

      err.message
    );

    return {

      action: "HOLD",
    };
  }
}

module.exports = {
  generateTradeDecision,
};
