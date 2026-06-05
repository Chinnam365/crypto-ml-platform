function simulateRisk({

  drawdown,

  volatility,

}) {

  return {

    riskScore:

      Number(

        (
          drawdown *
          volatility
        ).toFixed(2)
      ),

    drawdown,

    volatility,
  };
}

module.exports = {
  simulateRisk,
};
