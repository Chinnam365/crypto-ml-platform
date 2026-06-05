const {
  getRecoveryState,
} = require(
  "../ml/autonomousRecovery"
);

function evaluateRisk({

  drawdown,

  winRate,

}) {

  return getRecoveryState({

    drawdown,

    winRate,
  });
}

module.exports = {
  evaluateRisk,
};
