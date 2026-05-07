function evaluateDogeStrategy(data) {
  const {
    ema20,
    ema50,
    rsi,
    latestPrice,
  } = data;

  let confidence = 0;

  const reasons = [];

  let decision = "SKIP";

  // =========================
  // EMA TREND
  // =========================

  if (ema20 > ema50) {
    confidence += 2;

    reasons.push(
      "Bullish EMA trend"
    );
  } else {
    reasons.push(
      "Bearish EMA trend"
    );
  }

  // =========================
  // RSI MOMENTUM
  // =========================

  if (rsi >= 50 && rsi <= 65) {
    confidence += 2;

    reasons.push(
      "Healthy RSI momentum"
    );
  } else {
    reasons.push(
      "RSI outside ideal range"
    );
  }

  // =========================
  // FINAL DECISION
  // =========================

  if (
    ema20 > ema50 &&
    rsi >= 50 &&
    rsi <= 65 &&
    confidence >= 4
  ) {
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
