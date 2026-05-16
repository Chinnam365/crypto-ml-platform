async function getModelAnalytics(pool) {

  const result =
    await pool.query(`
      SELECT *
      FROM ml_dataset
      WHERE pnl IS NOT NULL
    `);

  const rows = result.rows;

  const totalSamples =
    rows.length;

  if (!totalSamples) {

    return {

      totalSamples: 0,

      winRate: 0,

      avgPnL: 0,
    };
  }

  let wins = 0;

  let totalPnL = 0;

  rows.forEach(row => {

    const pnl =
      Number(row.pnl || 0);

    totalPnL += pnl;

    if (pnl > 0) {

      wins++;
    }
  });

  const winRate =
    (
      wins / totalSamples
    ) * 100;

  const avgPnL =
    totalPnL / totalSamples;

  return {

    totalSamples,

    winRate:
      Number(
        winRate.toFixed(2)
      ),

    avgPnL:
      Number(
        avgPnL.toFixed(2)
      ),
  };
}

module.exports = {
  getModelAnalytics,
};
