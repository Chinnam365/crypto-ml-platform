function calculateTradeRisk(
  features
) {

  try {

    const {

      currentPrice,

      volatility,

      decision,

    } = features;

    // =========================
    // DEFAULTS
    // =========================

    let stopLoss = null;

    let takeProfit = null;

    // =========================
    // VOLATILITY FACTOR
    // =========================

    const riskFactor =

      Math.max(
        volatility * 2,
        0.3
      );

    // =========================
    // BUY SETUP
    // =========================

    if (
      decision === "BUY"
    ) {

      stopLoss =
        currentPrice *

        (
          1 -
          riskFactor / 100
        );

      takeProfit =
        currentPrice *

        (
          1 +
          (riskFactor * 2) / 100
        );
    }

    // =========================
    // SELL SETUP
    // =========================

    if (
      decision === "SELL"
    ) {

      stopLoss =
        currentPrice *

        (
          1 +
          riskFactor / 100
        );

      takeProfit =
        currentPrice *

        (
          1 -
          (riskFactor * 2) / 100
        );
    }

    // =========================
    // RISK REWARD
    // =========================

    const riskRewardRatio =
      2;

    return {

      stopLoss:
        Number(
          stopLoss.toFixed(2)
        ),

      takeProfit:
        Number(
          takeProfit.toFixed(2)
        ),

      riskRewardRatio,
    };

  } catch (err) {

    console.error(

      "Trade Risk Error:",

      err.message
    );

    return {

      stopLoss: null,

      takeProfit: null,

      riskRewardRatio: null,
    };
  }
}

module.exports = {
  calculateTradeRisk,
};
