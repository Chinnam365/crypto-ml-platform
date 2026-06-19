const {
  replayStrategy,
} = require("./strategyReplay");

async function runBacktest({
  strategy,
  candles,
}) {

  const trades =
    replayStrategy(candles);

  const wins =
    trades.filter(
      t => t.pnl > 0
    );

  const losses =
    trades.filter(
      t => t.pnl <= 0
    );

  const totalPnL =
    trades.reduce(
      (sum, t) =>
        sum + t.pnl,
      0
    );

  const avgPnL =
    trades.length
      ? totalPnL /
        trades.length
      : 0;

  const winRate =
    trades.length
      ? (
          wins.length /
          trades.length
        ) * 100
      : 0;

  return {

    strategy,

    candlesTested:
      candles.length,

    trades:
      trades.length,

    wins:
      wins.length,

    losses:
      losses.length,

    winRate:
      Number(
        winRate.toFixed(2)
      ),

    totalPnL:
      Number(
        totalPnL.toFixed(2)
      ),

    avgPnL:
      Number(
        avgPnL.toFixed(2)
      ),

    status:
      "COMPLETE",
  };
}

module.exports = {
  runBacktest,
};
