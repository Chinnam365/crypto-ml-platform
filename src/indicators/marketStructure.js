function calculateRelativeVolume(
  candles
) {

  if (
    candles.length < 20
  ) {
    return 1;
  }

  const recentVolume =
    candles[
      candles.length - 1
    ].volume;

  const averageVolume =
    candles
      .slice(-20)
      .reduce(
        (sum, c) =>
          sum + c.volume,
        0
      ) / 20;

  return (
    recentVolume /
    averageVolume
  );
}

// =====================================

function calculateBullishRatio(
  candles
) {

  if (
    candles.length < 10
  ) {
    return 0.5;
  }

  const recent =
    candles.slice(-10);

  const bullish =
    recent.filter(
      (c) =>
        c.close > c.open
    ).length;

  return (
    bullish / 10
  );
}

// =====================================

function calculateMomentum(
  closes
) {

  if (
    closes.length < 5
  ) {
    return 0;
  }

  const latest =
    closes[
      closes.length - 1
    ];

  const previous =
    closes[
      closes.length - 5
    ];

  return (
    (latest - previous) /
    previous
  );
}

// =====================================

function calculateVolatilityExpansion(
  volatilityHistory
) {

  if (
    volatilityHistory.length <
    10
  ) {
    return 1;
  }

  const latest =
    volatilityHistory[
      volatilityHistory.length - 1
    ];

  const average =
    volatilityHistory
      .slice(-10)
      .reduce(
        (a, b) => a + b,
        0
      ) / 10;

  return (
    latest / average
  );
}

module.exports = {

  calculateRelativeVolume,

  calculateBullishRatio,

  calculateMomentum,

  calculateVolatilityExpansion,
};
