async function runBacktest({

  strategy,

  candles,

}) {

  return {

    strategy,

    candlesTested:
      candles.length,

    winRate: 0,

    avgPnL: 0,

    status:
      "COMPLETE",
  };
}

module.exports = {
  runBacktest,
};
