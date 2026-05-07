const {
  startCooldown,
} = require("../risk/cooldown");

const {
  getActiveTrade,
  openTrade,
  closeTrade,
} = require("./tradeState");

const {
  saveTrade,
} = require("../logging/tradeLogger");

function createPaperTrade(price) {
  const trade = {
    symbol: "DOGEUSDT",

    entryPrice: price,

    takeProfit: price * 1.001,
stopLoss: price * 0.999,

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

  // TP
  if (currentPrice >= trade.takeProfit) {
    trade.status = "TP_HIT";

    trade.exitPrice = currentPrice;

    await saveTrade(trade);

    closeTrade();

    console.log("Take profit hit");

    return trade;
  }

  // SL
  if (currentPrice <= trade.stopLoss) {
    trade.status = "SL_HIT";

    trade.exitPrice = currentPrice;

    await saveTrade(trade);

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
