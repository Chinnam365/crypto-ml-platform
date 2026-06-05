function simulateExecution({

  symbol,

  side,

  quantity,

}) {

  return {

    symbol,

    side,

    quantity,

    slippage:
      0.15,

    filled:
      true,
  };
}

module.exports = {
  simulateExecution,
};
