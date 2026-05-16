const {
  BASE_RISK_REWARD,
} = require("../config/riskConfig");

function calculateTakeProfit({
  action,
  entryPrice,
  stopLoss,
  confidence,
}) {
  const risk = Math.abs(entryPrice - stopLoss);

  let rewardMultiplier = BASE_RISK_REWARD;

  if (confidence >= 85) {
    rewardMultiplier = 3;
  } else if (confidence >= 75) {
    rewardMultiplier = 2.5;
  }

  let takeProfit;

  if (action === "BUY") {
    takeProfit =
      entryPrice + risk * rewardMultiplier;
  } else {
    takeProfit =
      entryPrice - risk * rewardMultiplier;
  }

  return {
    takeProfit,
    rewardMultiplier,
  };
}

module.exports = {
  calculateTakeProfit,
};
