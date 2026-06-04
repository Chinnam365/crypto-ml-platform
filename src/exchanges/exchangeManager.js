const {
  placePaperOrder,
} = require(
  "./paperTradingExecutor"
);

const {
  placeBinanceOrder,
} = require(
  "./binanceExecutor"
);

async function executeTrade({

  exchange,

  symbol,

  side,

  quantity,

}) {

  switch (
    exchange
  ) {

    case "BINANCE":

      return await placeBinanceOrder({

        symbol,

        side,

        quantity,
      });

    case "PAPER":

    default:

      return await placePaperOrder({

        symbol,

        side,

        quantity,
      });
  }
}

module.exports = {
  executeTrade,
};
