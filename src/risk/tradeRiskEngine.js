function calculateTradeRisk(
  features
) {

  try {

    const {

      currentPrice = 0,

      volatility = 0,

      decision = "HOLD",

    } = features || {};

    // =========================
    // HOLD SAFETY
    // =========================

    if (
      !decision ||

      decision === "HOLD"
    ) {

      return {

        stopLoss: null,

        takeProfit: null,

        riskRewardRatio: null,
      };
    }

    // =========================
    // INPUT VALIDATION
    // =========================

    if (

      !currentPrice ||

      isNaN(currentPrice) ||

      currentPrice <= 0
    ) {

      console.log(`
==================================
INVALID CURRENT PRICE
==================================

Current Price:
${currentPrice}

==================================
`);

      return {

        stopLoss: null,

        takeProfit: null,

        riskRewardRatio: null,
      };
    }

    // =========================
    // SAFE VOLATILITY
    // =========================

    const safeVolatility =

      isNaN(volatility)
        ? 1
        : Math.max(
            Number(volatility),
            0.3
          );

    // =========================
    // VOLATILITY FACTOR
    // =========================

    const riskFactor =
      safeVolatility * 2;

    let stopLoss = null;

    let takeProfit = null;

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
          (
            riskFactor * 2
          ) / 100
        );
    }

    // =========================
    // SELL SETUP
    // =========================

    else if (
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
          (
            riskFactor * 2
          ) / 100
        );
    }

    // =========================
    // FINAL VALIDATION
    // =========================

    if (

      stopLoss === null ||

      takeProfit === null ||

      isNaN(stopLoss) ||

      isNaN(takeProfit)
    ) {

      console.log(`
==================================
INVALID RISK OUTPUT
==================================

Decision:
${decision}

Stop Loss:
${stopLoss}

Take Profit:
${takeProfit}

==================================
`);

      return {

        stopLoss: null,

        takeProfit: null,

        riskRewardRatio: null,
      };
    }

    // =========================
    // RISK REWARD
    // =========================

    const riskRewardRatio = 2;

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

    console.log(`
==================================
TRADE RISK ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

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
