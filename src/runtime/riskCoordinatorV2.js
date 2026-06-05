const {
  evaluateRisk,
} = require(
  "../integration/riskCoordinator"
);

async function runRiskCycle({

  drawdown,

  winRate,

}) {

  return evaluateRisk({

    drawdown,

    winRate,
  });
}

module.exports = {
  runRiskCycle,
};
