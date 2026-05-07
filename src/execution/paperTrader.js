const {
  getActiveTrade,
  openTrade,
  closeTrade,
} = require("./tradeState");

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

  return trade;
}

function monitorTrade(currentPrice) {
  const trade = getActiveTrade();

  if (!trade) {
    return null;
  }

  // Take Profit
  if (currentPrice >= trade.takeProfit) {
    trade.status = "TP_HIT";
    trade.exitPrice = currentPrice;

    closeTrade();

    return trade;
  }

  // Stop Loss
  if (currentPrice <= trade.stopLoss) {
    trade.status = "SL_HIT";
    trade.exitPrice = currentPrice;

    closeTrade();

    return trade;
  }

  return trade;
}

module.exports = {
  createPaperTrade,
  monitorTrade,
};
