const {
  getActiveTrade,
  openTrade,
  closeTrade,
} = require("./tradeState");

const {
  saveTrade,
} = require("../logging/tradeLogger");

const {
  startCooldown,
} = require("../risk/cooldown");

function createPaperTrade(price) {
  const trade = {
    symbol: "DOGEUSDT",

    entryPrice: price,

    takeProfit: price * 1.01,

    stopLoss: price * 0.995,

    openedAt: new Date(),

    status: "OPEN",
  };

  openTrade(trade);

  console.log("Trade opened");

  return trade;
}

async function monitorTrade(currentPrice) {
  const trade = getActiveTrade();

  if (!trade) {
    return null;
  }

  // TAKE PROFIT
  if (currentPrice >= trade.takeProfit) {
    trade.status = "TP_HIT";

    trade.exitPrice = currentPrice;

    await saveTrade(trade);

    startCooldown();

    closeTrade();

    console.log("Take profit hit");

    return trade;
  }

  // STOP LOSS
  if (currentPrice <= trade.stopLoss) {
    trade.status = "SL_HIT";

    trade.exitPrice = currentPrice;

    await saveTrade(trade);

    startCooldown();

    closeTrade();

    console.log("Stop loss hit");

    return trade;
  }

  return trade;
}

module.exports = {
  createPaperTrade,
  monitorTrade,
};
