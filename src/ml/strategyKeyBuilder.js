function buildStrategyKey({

    regime = "UNKNOWN",

    trend = "SIDEWAYS",

    volatilityRegime = "NORMAL",

    momentumState = "NEUTRAL",

    decision = "HOLD",

}) {

    return [

        regime,

        trend,

        volatilityRegime,

        momentumState,

        decision,

    ].join("_");

}

module.exports = {

    buildStrategyKey,

};
