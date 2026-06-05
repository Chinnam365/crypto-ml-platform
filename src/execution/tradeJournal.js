class TradeJournal {

  constructor() {

    this.entries = [];
  }

  log(
    trade
  ) {

    this.entries.push({

      ...trade,

      timestamp:
        new Date()
          .toISOString(),
    });
  }

  getHistory() {

    return this.entries;
  }
}

module.exports =
  new TradeJournal();
