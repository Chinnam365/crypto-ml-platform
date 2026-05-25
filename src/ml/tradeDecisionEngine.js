function generateTradeDecision(
  features
) {

  try {

    const {

      trend,

      rsi,

      confidence,

      regime,

    } = features;

    let action =
      "HOLD";

    // =========================
    // AGGRESSIVE BUY
    // =========================

    if (

      trend === "BULLISH"

      &&

      rsi >= 50

      &&

      confidence >= 40

    ) {

      action = "BUY";
    }

    // =========================
    // AGGRESSIVE SELL
    // =========================

    if (

      trend === "BEARISH"

      &&

      rsi <= 50

      &&

      confidence >= 40

    ) {

      action = "SELL";
    }

    // =========================
    // SIDEWAYS FILTER
    // =========================

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
