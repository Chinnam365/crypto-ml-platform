const {
  getHistoricalCandles,
} = require("./historicalData");

const {
  replayStrategy,
} = require("./strategyReplay");

const {
  calculateMetrics,
} = require("./metrics");

async function runBacktest({

  symbol = "BTCUSDT",

  interval = "15m",

  limit = 500,
}) {

  console.log(`
==================================
RUNNING BACKTEST
==================================

Symbol:
${symbol}

Interval:
${interval}

Candles:
${limit}

==================================
`);

  const candles =
    await getHistoricalCandles({

      symbol,

      interval,

      limit,
    });

  const trades =
    replayStrategy(candles);

  const metrics =
    calculateMetrics(trades);

  return {

  symbol,

  interval,

  candles:
    candles.length,

  metrics,

  sampleTrades:
    trades.slice(0, 10),
};
}

module.exports = {
  runBacktest,
};
