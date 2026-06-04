function calculateAIPerformance({

  winRate,

  avgPnL,

  confidenceAccuracy,

  drawdown,

}) {

  const score =

    (winRate * 0.4)

    +

    (avgPnL * 0.2)

    +

    (confidenceAccuracy * 0.3)

    -

    (drawdown * 0.1);

  return {

    score:
      Number(
        score.toFixed(2)
      ),

    winRate,

    avgPnL,

    confidenceAccuracy,

    drawdown,
  };
}

module.exports = {
  calculateAIPerformance,
};
