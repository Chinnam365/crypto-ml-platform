class RuntimeTradeRegistry {

  constructor() {

    this.trades = [];
  }

  register(
    trade
  ) {

    this.trades.push({

      ...trade,

      timestamp:
        new Date()
          .toISOString(),
    });
  }

  latest(
    count = 100
  ) {

    return this.trades
      .slice(-count)
      .reverse();
  }

  count() {

    return this.trades.length;
  }
}

module.exports =
  new RuntimeTradeRegistry();
