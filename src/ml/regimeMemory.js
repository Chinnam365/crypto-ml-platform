async function getRegimeMemory(pool) {

  const result =
    await pool.query(`
      SELECT
        regime,

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

      GROUP BY regime
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
      // REGIME SCORE
      // ==========================================

      const regimeScore =
        (
          winRate * 0.6
        ) +
        (
          avgPnL * 0.4
        ) -
        (
          avgDuration * 0.1
        );

      return {

        regime:
          row.regime,

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

        regimeScore:
          Number(
            regimeScore.toFixed(2)
          ),
      };
    });

  memory.sort(
    (a, b) =>
      b.regimeScore -
      a.regimeScore
  );

  return memory;
}

module.exports = {
  getRegimeMemory,
};
