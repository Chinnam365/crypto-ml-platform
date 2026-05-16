async function getSymbolMemory(pool) {

  const result =
    await pool.query(`
      SELECT
        symbol,

        COUNT(*) as trades,

        AVG(pnl) as avg_pnl,

        AVG(duration_minutes)
          as avg_duration,

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

  const memory =
    rows.map(row => {

      const trades =
        Number(row.trades || 0);

      const wins =
        Number(row.wins || 0);

      const avgPnL =
        Number(row.avg_pnl || 0);

      const avgDuration =
        Number(
          row.avg_duration || 0
        );

      const winRate =
        trades > 0
          ? (wins / trades) * 100
          : 0;

      // ==========================================
      // SYMBOL QUALITY SCORE
      // ==========================================

      const qualityScore =
        (
          winRate * 0.5
        ) +
        (
          avgPnL * 0.3
        ) -
        (
          avgDuration * 0.2
        );

      return {

        symbol:
          row.symbol,

        trades,

        wins,

        winRate:
          Number(
            winRate.toFixed(2)
          ),

        avgPnL:
          Number(
            avgPnL.toFixed(2)
          ),

        avgDuration:
          Number(
            avgDuration.toFixed(2)
          ),

        qualityScore:
          Number(
            qualityScore.toFixed(2)
          ),
      };
    });

  memory.sort(
    (a, b) =>
      b.qualityScore -
      a.qualityScore
  );

  return memory;
}

module.exports = {
  getSymbolMemory,
};
