function calculateMetrics(trades) {

  if (!trades.length) {

    return {

      totalTrades: 0,

      winRate: 0,

      totalPnL: 0,

      avgPnL: 0,
    };
  }

  let wins = 0;

  let totalPnL = 0;

  trades.forEach(trade => {

    totalPnL += trade.pnl;

    if (trade.pnl > 0) {

      wins++;
    }
  });

  const winRate =
    (
      wins / trades.length
    ) * 100;

  const avgPnL =
    totalPnL / trades.length;

  return {

    totalTrades:
      trades.length,

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
  };
}

module.exports = {
  calculateMetrics,
};
