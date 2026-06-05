class MarketDataCache {

  constructor() {

    this.cache =
      new Map();
  }

  set(
    symbol,
    data
  ) {

    this.cache.set(

      symbol,

      {

        data,

        timestamp:
          Date.now(),
      }
    );
  }

  get(
    symbol
  ) {

    return this.cache.get(
      symbol
    );
  }
}

module.exports =
  new MarketDataCache();
