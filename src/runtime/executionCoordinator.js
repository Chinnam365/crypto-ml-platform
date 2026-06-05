const {
  executeTrade,
} = require(
  "../exchanges/exchangeManager"
);

async function executeApprovedTrade(
  trade
) {

  return executeTrade(
    trade
  );
}

module.exports = {
  executeApprovedTrade,
};
