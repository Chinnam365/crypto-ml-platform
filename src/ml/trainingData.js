async function getTrainingData(pool) {

  const result =
    await pool.query(`
      SELECT
        rsi,
        macd,
        volatility,
        confidence,
        trend,
        regime,
        pnl
      FROM ml_dataset
      WHERE pnl IS NOT NULL
    `);

  return result.rows.map(row => ({

    // ==========================================
    // NUMERICAL FEATURES
    // ==========================================

    rsi:
      Number(row.rsi || 0),

    macd:
      Number(row.macd || 0),

    volatility:
      Number(
        row.volatility || 0
      ),

    confidence:
      Number(
        row.confidence || 0
      ),

    // ==========================================
    // FEATURE ENGINEERING
    // ==========================================

    bullishTrend:
      row.trend === "BULLISH"
        ? 1
        : 0,

    bearishTrend:
      row.trend === "BEARISH"
        ? 1
        : 0,

    trendingRegime:
      row.regime &&
      row.regime.includes(
        "TRENDING"
      )
        ? 1
        : 0,

    sidewaysRegime:
      row.regime === "SIDEWAYS"
        ? 1
        : 0,

    // ==========================================
    // LABEL
    // ==========================================

    label:
      row.pnl > 0 ? 1 : 0,
  }));
}

module.exports = {
  getTrainingData,
};
