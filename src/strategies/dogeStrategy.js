function evaluateDogeStrategy(data) {
  const {
    ema5m20,
    ema5m50,

    ema15m20,
    ema15m50,

    ema1h20,
    ema1h50,

    rsi5m,

    latestPrice,
  } = data;

  let confidence = 0;

  const reasons = [];

  let decision = "SKIP";

  // =========================
  // 1H TREND
  // =========================

  const bullish1h =
    ema1h20 > ema1h50;

  if (bullish1h) {
    confidence += 2;

    reasons.push(
      "1h bullish trend"
    );
  } else {
    reasons.push(
      "1h bearish trend"
    );
  }

  // =========================
  // 15M TREND
  // =========================

  const bullish15m =
    ema15m20 > ema15m50;

  if (bullish15m) {
    confidence += 2;

    reasons.push(
      "15m bullish trend"
    );
  } else {
    reasons.push(
      "15m bearish trend"
    );
  }

  // =========================
  // 5M TREND
  // =========================

  const bullish5m =
    ema5m20 > ema5m50;

  if (bullish5m) {
    confidence += 2;

    reasons.push(
      "5m bullish trend"
    );
  } else {
    reasons.push(
      "5m bearish trend"
    );
  }

  // =========================
  // RSI
  // =========================

  const validRsi =
    rsi5m >= 50 &&
    rsi5m <= 65;

  if (validRsi) {
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
    bullish1h &&
    bullish15m &&
    bullish5m &&
    validRsi &&
    confidence >= 8
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
