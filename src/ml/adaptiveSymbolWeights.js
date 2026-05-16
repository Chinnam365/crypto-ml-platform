async function getAdaptiveSymbolWeights(pool) {

  const result =
    await pool.query(`
      SELECT
        symbol,

        COUNT(*) as trades,

        AVG(pnl) as avg_pnl,

        SUM(
          CASE
            WHEN pnl > 0
            THEN 1
            ELSE 0
          END
        ) as wins

      FROM ml_dataset

      GROUP BY symbol
    `);

  const rows =
    result.rows;

  const weights = {};

  rows.forEach(row => {

    const trades =
      Number(row.trades || 0);

    const wins =
      Number(row.wins || 0);

    const avgPnL =
      Number(row.avg_pnl || 0);

    const winRate =
      trades > 0
        ? (wins / trades) * 100
        : 50;

    // ==========================================
    // SYMBOL SCORE
    // ==========================================

    let score =
      (
        winRate * 0.6
      ) +
      (
        avgPnL * 0.4
      );

    // ==========================================
    // NORMALIZE
    // ==========================================

    let weight = 1;

    if (score > 70) {

      weight = 1.3;
    }

    else if (score > 55) {

      weight = 1.15;
    }

    else if (score < 40) {

      weight = 0.7;
    }

    else if (score < 50) {

      weight = 0.85;
    }

    weights[row.symbol] =
      Number(weight.toFixed(2));
  });

  return weights;
}

module.exports = {
  getAdaptiveSymbolWeights,
};
