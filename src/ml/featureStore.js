class FeatureStore {

  constructor() {

    this.features =
      new Map();
  }

  save({

    symbol,

    features,

  }) {

    this.features.set(

      symbol,

      {

        features,

        timestamp:
          Date.now(),
      }
    );
  }

  get(
    symbol
  ) {

    return this.features.get(
      symbol
    );
  }
}

module.exports =
  new FeatureStore();
