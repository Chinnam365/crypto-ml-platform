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

    btcBullish,
  } = data;

  let score = 0;

  const reasons = [];

  // =========================
  // BTC MARKET
  // =========================

  if (btcBullish) {
    score += 3;

    reasons.push(
      "BTC bullish"
    );
  } else {
    reasons.push(
      "BTC bearish"
    );
  }

  // =========================
  // 1H TREND
  // =========================

  const bullish1h =
    ema1h20 > ema1h50;

  if (bullish1h) {
    score += 3;

    reasons.push(
      "1h bullish"
    );
  } else {
    reasons.push(
      "1h bearish"
    );
  }

  // =========================
  // 15M TREND
  // =========================

  const bullish15m =
    ema15m20 > ema15m50;

  if (bullish15m) {
    score += 2;

    reasons.push(
      "15m bullish"
    );
  } else {
    reasons.push(
      "15m bearish"
    );
  }

  // =========================
  // 5M TREND
  // =========================

  const bullish5m =
    ema5m20 > ema5m50;

  if (bullish5m) {
    score += 1;

    reasons.push(
      "5m bullish"
    );
  } else {
    reasons.push(
      "5m bearish"
    );
  }

  // =========================
  // RSI
  // =========================

  const idealRsi =
    rsi5m >= 50 &&
    rsi5m <= 65;

  if (idealRsi) {
    score += 2;

    reasons.push(
      "RSI ideal"
    );
  } else {
    reasons.push(
      "RSI weak"
    );
  }

  // =========================
  // DECISION
  // =========================

  let decision = "SKIP";

  if (score >= 8) {
    decision = "BUY";
  }

  return {
    latestPrice,

    score,

    decision,

    reasons,
  };
}

module.exports = {
  evaluateDogeStrategy,
};
