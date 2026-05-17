async function saveDecisionMemory({

  pool,

  side,

  trend,

  regime,

  quality,

  confidence,

  volatility,

  multiTf,

  pnl = 0,
}) {

  const pattern = [

    trend,

    regime,

    multiTf.overallTrend,

    quality >= 70
      ? "HIGH_QUALITY"
      : "NORMAL_QUALITY",

  ].join("_");

  await pool.query(
    `
    INSERT INTO decision_memory
    (
      pattern,
      side,
      confidence,
      volatility,
      pnl
    )
    VALUES
    ($1,$2,$3,$4,$5)
    `,
    [
      pattern,

      side,

      confidence,

      volatility,

      pnl,
    ]
  );
}

async function getDecisionMemory(pool) {

  const result =
    await pool.query(`
      SELECT
        pattern,

        COUNT(*) AS trades,

        AVG(pnl) AS avg_pnl

      FROM decision_memory

      GROUP BY pattern

      ORDER BY avg_pnl DESC
    `);

  return result.rows;
}

module.exports = {

  saveDecisionMemory,

  getDecisionMemory,
};
