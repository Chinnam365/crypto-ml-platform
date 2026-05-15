function detectMarketRegime(
  closes
) {

  if (
    !closes ||
    closes.length < 50
  ) {

    return "UNKNOWN";
  }

  const recent =
    closes.slice(-20);

  const high =
    Math.max(...recent);

  const low =
    Math.min(...recent);

  const range =
    ((high - low) / low) * 100;

  const first =
    recent[0];

  const last =
    recent[recent.length - 1];

  const trendMove =
    ((last - first) / first) * 100;

  // =========================
  // STRONG TREND
  // =========================

  if (
    Math.abs(trendMove) > 3
  ) {

    if (trendMove > 0) {

      return "TRENDING_BULLISH";
    }

    return "TRENDING_BEARISH";
  }

  // =========================
  // SIDEWAYS
  // =========================

  if (range < 2) {

    return "SIDEWAYS";
  }

  // =========================
  // VOLATILE
  // =========================

  return "VOLATILE";
}

module.exports = {
  detectMarketRegime,
};
