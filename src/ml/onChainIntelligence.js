function analyzeOnChainMetrics({

  activeAddresses,

  transactionCount,

  transactionVolume,

}) {

  let score = 0;

  score +=
    activeAddresses * 0.3;

  score +=
    transactionCount * 0.3;

  score +=
    transactionVolume * 0.4;

  let sentiment =
    "NEUTRAL";

  if (score > 100000) {

    sentiment =
      "BULLISH";
  }

  if (score < 10000) {

    sentiment =
      "BEARISH";
  }

  return {

    score,

    sentiment,
  };
}

module.exports = {
  analyzeOnChainMetrics,
};
