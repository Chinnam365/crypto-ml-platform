function calculateScore(data) {

  const {
    btcBullish,

    bullish1h,

    bullish15m,

    bullish5m,

    idealRsi,
  } = data;

  let score = 0;

  const reasons = [];

  // BTC

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

  // 1H

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

  // 15M

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

  // 5M

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

  // RSI

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

  return {
    score,

    reasons,
  };
}

module.exports = {
  calculateScore,
};
