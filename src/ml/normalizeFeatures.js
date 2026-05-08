function normalizeFeatures(
  features
) {

  return {

    rsi:
      features.rsi / 100,

    volatility:
      features.volatility *
      1000,

    score:
      features.score / 10,

    bullish5m:
      features.bullish5m
        ? 1
        : 0,

    bullish15m:
      features.bullish15m
        ? 1
        : 0,

    bullish1h:
      features.bullish1h
        ? 1
        : 0,

    btcBullish:
      features.btcBullish
        ? 1
        : 0,

    ema5mSpread:
      features.ema5mSpread *
      1000,

    ema15mSpread:
      features.ema15mSpread *
      1000,

    ema1hSpread:
      features.ema1hSpread *
      1000,

    atr:
      (features.atr || 0) *
      100,

    candleBody:
      (features.candleBody ||
        0) * 100,

    upperWick:
      (features.upperWick ||
        0) * 100,

    lowerWick:
      (features.lowerWick ||
        0) * 100,

    emaSlope:
      (features.emaSlope ||
        0) * 1000,

    rsiSlope:
      (features.rsiSlope ||
        0) / 10,

    distanceFromEma:
      (features.distanceFromEma ||
        0) * 1000,

    relativeVolume:
      features.relativeVolume ||
      1,

    bullishRatio:
      features.bullishRatio ||
      0.5,

    momentum:
      (features.momentum ||
        0) * 100,

    volatilityExpansion:
      features.volatilityExpansion ||
      1,
  };
}

module.exports = {
  normalizeFeatures,
};
