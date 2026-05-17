function calculateSignalScores({

  rsi,

  macd,

  trend,

  regime,

  multiTf,
}) {

  let buyScore = 0;

  let sellScore = 0;

  // ==========================================
  // RSI
  // ==========================================

  if (rsi < 30) {

    buyScore += 30;
  }

  else if (rsi < 40) {

    buyScore += 20;
  }

  else if (rsi < 50) {

    buyScore += 10;
  }

  if (rsi > 70) {

    sellScore += 30;
  }

  else if (rsi > 60) {

    sellScore += 20;
  }

  else if (rsi > 50) {

    sellScore += 10;
  }

  // ==========================================
  // MACD
  // ==========================================

  if (macd > 0) {

    buyScore += 20;
  }

  if (macd < 0) {

    sellScore += 20;
  }

  // ==========================================
  // TREND
  // ==========================================

  if (trend === "BULLISH") {

    buyScore += 20;
  }

  if (trend === "BEARISH") {

    sellScore += 20;
  }

  // ==========================================
  // REGIME
  // ==========================================

  if (regime === "TRENDING") {

    buyScore += 10;

    sellScore += 10;
  }

  // ==========================================
  // MULTI TIMEFRAME
  // ==========================================

  if (

    multiTf.overallTrend ===
    "BULLISH"

  ) {

    buyScore += 20;
  }

  if (

    multiTf.overallTrend ===
    "BEARISH"

  ) {

    sellScore += 20;
  }

  return {

    buyScore,

    sellScore,
  };
}

module.exports = {
  calculateSignalScores,
};
