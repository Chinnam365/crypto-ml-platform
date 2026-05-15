// =====================================
// AI CONFIDENCE ENGINE
// =====================================

function calculateConfidence({

  rsi,

  macd,

  trend,

  regime,

  volatility,

  avgSymbolPnL = 0,
}) {

  let confidence = 50;

  // =================================
  // RSI
  // =================================

  if (rsi < 20) {

    confidence += 15;
  }

  else if (rsi < 30) {

    confidence += 10;
  }

  if (rsi > 80) {

    confidence += 15;
  }

  else if (rsi > 70) {

    confidence += 10;
  }

  // =================================
  // MACD
  // =================================

  if (Math.abs(macd) > 2) {

    confidence += 15;
  }

  else if (
    Math.abs(macd) > 1
  ) {

    confidence += 10;
  }

  // =================================
  // TREND
  // =================================

  if (

    trend === "BULLISH" ||

    trend === "BEARISH"
  ) {

    confidence += 10;
  }

  // =================================
  // MARKET REGIME
  // =================================

  if (

    regime ===
      "TRENDING_BULLISH" ||

    regime ===
      "TRENDING_BEARISH"
  ) {

    confidence += 10;
  }

  // =================================
  // VOLATILITY
  // =================================

  if (volatility > 2) {

    confidence += 10;
  }

  else if (
    volatility > 1
  ) {

    confidence += 5;
  }

  // =================================
  // SYMBOL PERFORMANCE
  // =================================

  if (avgSymbolPnL > 0) {

    confidence += 10;
  }

  else if (
    avgSymbolPnL < 0
  ) {

    confidence -= 15;
  }

  // =================================
  // LIMITS
  // =================================

  if (confidence > 100) {

    confidence = 100;
  }

  if (confidence < 0) {

    confidence = 0;
  }

  return confidence;
}

module.exports = {
  calculateConfidence,
};
