function calculateStopLoss({
  action,
  entryPrice,
  volatility,
}) {
  let stopLossPercent;

  if (volatility >= 8) {
    stopLossPercent = 4;
  } else if (volatility >= 5) {
    stopLossPercent = 3;
  } else if (volatility >= 3) {
    stopLossPercent = 2;
  } else {
    stopLossPercent = 1.5;
  }

  let stopLoss;

  if (action === "BUY") {
    stopLoss =
      entryPrice * (1 - stopLossPercent / 100);
  } else {
    stopLoss =
      entryPrice * (1 + stopLossPercent / 100);
  }

  return {
    stopLoss,
    stopLossPercent,
  };
}

module.exports = {
  calculateStopLoss,
};
