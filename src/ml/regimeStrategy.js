function getRegimeStrategy({

  regime,

  trend,

  rsi,

  macd,
}) {

  let side = "HOLD";

  let confidenceBoost = 0;

  // ==========================================
  // TRENDING BULLISH
  // ==========================================

  if (

    regime ===
      "TRENDING" &&

    trend ===
      "BULLISH"

  ) {

    if (

      rsi < 55 &&

      macd > 0

    ) {

      side = "BUY";

      confidenceBoost = 10;
    }
  }

  // ==========================================
  // TRENDING BEARISH
  // ==========================================

  else if (

    regime ===
      "TRENDING" &&

    trend ===
      "BEARISH"

  ) {

    if (

      rsi > 45 &&

      macd < 0

    ) {

      side = "SELL";

      confidenceBoost = 10;
    }
  }

  // ==========================================
  // SIDEWAYS MARKET
  // ==========================================

  else if (

    regime ===
      "SIDEWAYS"

  ) {

    // Mean Reversion BUY

    if (

      rsi < 40 &&

      macd > -1

    ) {

      side = "BUY";

      confidenceBoost = 5;
    }

    // Mean Reversion SELL

    else if (

      rsi > 60 &&

      macd < 1

    ) {

      side = "SELL";

      confidenceBoost = 5;
    }
  }

  return {

    side,

    confidenceBoost,
  };
}

module.exports = {
  getRegimeStrategy,
};
