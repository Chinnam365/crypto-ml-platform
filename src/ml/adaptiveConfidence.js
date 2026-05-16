async function getAdaptiveConfidence(pool) {

  const result =
    await pool.query(`
      SELECT pnl
      FROM ml_dataset
      ORDER BY id DESC
      LIMIT 20
    `);

  const rows = result.rows;

  // ==========================================
  // DEFAULT THRESHOLD
  // ==========================================

  let threshold = 60;

  if (!rows.length) {

    return threshold;
  }

  let wins = 0;

  rows.forEach(row => {

    if (
      Number(row.pnl) > 0
    ) {

      wins++;
    }
  });

  const winRate =
    (
      wins / rows.length
    ) * 100;

  // ==========================================
  // ADAPTIVE LOGIC
  // ==========================================

  if (winRate < 40) {

    threshold = 75;
  }

  else if (winRate < 50) {

    threshold = 68;
  }

  else if (winRate > 70) {

    threshold = 55;
  }

  console.log(`
==================================
ADAPTIVE CONFIDENCE
==================================

Recent Win Rate:
${winRate.toFixed(2)}%

Dynamic Threshold:
${threshold}

==================================
`);

  return threshold;
}

module.exports = {
  getAdaptiveConfidence,
};
