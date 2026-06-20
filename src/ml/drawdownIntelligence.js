/*
==================================================
DRAWDOWN INTELLIGENCE
==================================================
*/

function getDrawdownState({

  currentEquity = 10000,

  peakEquity = 10000,
} = {}) {

  try {

    /*
    ==========================================
    DRAWDOWN %
    ==========================================
    */

    let drawdownPercent = 0;

    if (
      peakEquity > 0
    ) {

      drawdownPercent =

        (
          (
            peakEquity -
            currentEquity
          )

          /

          peakEquity
        ) * 100;
    }

    drawdownPercent =

      Math.max(
        0,
        Number(
          drawdownPercent.toFixed(2)
        )
      );

    /*
    ==========================================
    RISK MODE
    ==========================================
    */

    let riskMode =
      "NORMAL";

    if (
      drawdownPercent >= 30
    ) {

      riskMode =
        "CAPITAL_PRESERVATION";
    }

    else if (
      drawdownPercent >= 20
    ) {

      riskMode =
        "DEFENSIVE";
    }

    else if (
      drawdownPercent >= 10
    ) {

      riskMode =
        "CAUTION";
    }

    console.log(`
==================================
DRAWDOWN INTELLIGENCE
==================================
Max Drawdown:
${drawdownPercent}

Risk Mode:
${riskMode}
==================================
`);

    return {

      drawdownPercent,

      riskMode,

      if (
  !drawdownState.allowTrading
) {

  console.log(
    "DRAWDOWN LOCKDOWN"
  );

  continue;
}
    };

  } catch (err) {

    console.log(`
==================================
DRAWDOWN ERROR
==================================
`);

    console.log(err);

    console.log(`
==================================
`);

    return {

      drawdownPercent: 0,

      riskMode: "NORMAL",

      allowTrading: true,
    };
  }
}

/*
==================================================
BACKWARD COMPATIBILITY
==================================================
*/

function evaluateMarketAnomalies(
  options = {}
) {

  return getDrawdownState(
    options
  );
}

module.exports = {

  getDrawdownState,

  evaluateMarketAnomalies,
};
