async function getAdaptiveSizeMultiplier({

  pool,

  confidence,
}) {

  const result =
    await pool.query(`
      SELECT pnl
      FROM ml_dataset
      ORDER BY id DESC
      LIMIT 20
    `);

  const rows =
    result.rows;

  // ==========================================
  // DEFAULT MULTIPLIER
  // ==========================================

  let multiplier = 1;

  if (!rows.length) {

    return multiplier;
  }

  let wins = 0;

  rows.forEach(row => {

    if (
      Number(row.pnl) > 0
    ) {

      wins++;
    }
  });

  const recentWinRate =
    (
      wins / rows.length
    ) * 100;

  // ==========================================
  // CONFIDENCE FACTOR
  // ==========================================

  if (confidence >= 85) {

    multiplier += 0.25;
  }

  else if (confidence >= 75) {

    multiplier += 0.15;
  }

  // ==========================================
  // PERFORMANCE FACTOR
  // ==========================================

  if (recentWinRate < 40) {

    multiplier -= 0.4;
  }

  else if (
    recentWinRate < 50
  ) {

    multiplier -= 0.2;
  }

  else if (
    recentWinRate > 70
  ) {

    multiplier += 0.2;
  }

  // ==========================================
  // SAFETY LIMITS
  // ==========================================

  if (multiplier < 0.5) {

    multiplier = 0.5;
  }

  if (multiplier > 1.5) {

    multiplier = 1.5;
  }

  console.log(`
==================================
ADAPTIVE POSITION SIZING
==================================

Recent Win Rate:
${recentWinRate.toFixed(2)}%

Confidence:
${confidence}

Size Multiplier:
${multiplier.toFixed(2)}

==================================
`);

  return multiplier;
}

module.exports = {
  getAdaptiveSizeMultiplier,
};
