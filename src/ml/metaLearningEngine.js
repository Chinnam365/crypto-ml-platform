function evaluateAIPerformance({

  winRate,

  avgPnL,

  drawdown,

}) {

  let grade =
    "C";

  if (
    winRate > 60 &&
    avgPnL > 0
  ) {

    grade = "A";
  }

  else if (
    winRate > 50
  ) {

    grade = "B";
  }

  return {

    grade,

    winRate,

    avgPnL,

    drawdown,
  };
}

module.exports = {
  evaluateAIPerformance,
};
