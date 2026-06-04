function generateTradeAnalytics({

  totalTrades,

  wins,

  losses,

  avgPnL,

}) {

  const winRate =

    totalTrades > 0

      ? (
          wins /
          totalTrades
        ) * 100

      : 0;

  return {

    totalTrades,

    wins,

    losses,

    avgPnL,

    winRate:
      Number(
        winRate.toFixed(2)
      ),
  };
}

module.exports = {
  generateTradeAnalytics,
};
