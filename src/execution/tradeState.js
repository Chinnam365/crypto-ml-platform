let activeTrade = null;

function getActiveTrade() {
  return activeTrade;
}

function openTrade(trade) {
  activeTrade = trade;
}

function closeTrade() {
  activeTrade = null;
}

module.exports = {
  getActiveTrade,
  openTrade,
  closeTrade,
};
