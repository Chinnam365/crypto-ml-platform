async function getTrainingData(pool) {

  const result =
    await pool.query(`
      SELECT
        rsi,
        macd,
        volatility,
        confidence,
        pnl
      FROM ml_dataset
      WHERE pnl IS NOT NULL
    `);

  return result.rows.map(row => ({

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

    label:
      row.pnl > 0 ? 1 : 0,
  }));
}

module.exports = {
  getTrainingData,
};
