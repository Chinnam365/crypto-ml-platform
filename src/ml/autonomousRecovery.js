function getRecoveryState({

  drawdown,

  winRate,

}) {

  let state =
    "NORMAL";

  let riskMultiplier =
    1;

  if (
    drawdown > 10
  ) {

    state =
      "RECOVERY";

    riskMultiplier =
      0.5;
  }

  if (
    drawdown > 20
  ) {

    state =
      "HEALING";

    riskMultiplier =
      0.25;
  }

  return {

    state,

    riskMultiplier,

    winRate,

    drawdown,
  };
}

module.exports = {
  getRecoveryState,
};
