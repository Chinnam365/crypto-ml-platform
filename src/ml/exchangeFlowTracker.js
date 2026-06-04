function analyzeExchangeFlows({

  inflow,

  outflow,

}) {

  const netFlow =
    inflow - outflow;

  let sentiment =
    "NEUTRAL";

  if (
    netFlow > 0
  ) {

    sentiment =
      "BEARISH";
  }

  if (
    netFlow < 0
  ) {

    sentiment =
      "BULLISH";
  }

  return {

    inflow,

    outflow,

    netFlow,

    sentiment,
  };
}

module.exports = {
  analyzeExchangeFlows,
};
