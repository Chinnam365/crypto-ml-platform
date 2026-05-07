function evaluateDogeStrategy(data) {
  const { ema20, ema50, rsi, latestPrice } = data;

  let confidence = 0;

  const reasons = [];

  let decision = "SKIP";

  // Trend check
  if (ema20 > ema50) {
    confidence += 2;
    reasons.push("Bullish EMA trend");
  } else {
    reasons.push("Bearish EMA trend");
  }

  // RSI recovery
  if (rsi > 50 && rsi < 70) {
    confidence += 2;
    reasons.push("RSI bullish recovery");
  }

  // Oversold condition
  if (rsi < 30) {
    confidence += 1;
    reasons.push("RSI oversold");
  }

  // Final decision
  if (confidence >= 1) {
    decision = "BUY";
  }

  return {
    latestPrice,
    decision,
    confidence,
    reasons,
  };
}

module.exports = {
  evaluateDogeStrategy,
};
