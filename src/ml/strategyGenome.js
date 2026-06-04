function createStrategyGenome({

  regime,

  trend,

  momentum,

  volatility,

}) {

  return [

    regime,

    trend,

    momentum,

    volatility,

  ].join("_");
}

module.exports = {
  createStrategyGenome,
};
