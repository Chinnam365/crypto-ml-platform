async function updateReinforcementMemory({

  pool,

  symbol,

  side,

  regime,

  trend,

  quality,

  confidence,

  pnl,
}) {

  // ==========================================
  // BUILD PATTERN
  // ==========================================

  const pattern = [

    symbol,

    side,

    regime,

    trend,

    quality >= 70
      ? "HIGH_QUALITY"
      : "NORMAL_QUALITY",

  ].join("_");

  // ==========================================
  // REWARD SCORE
  // ==========================================

  let reward = 0;

  if (pnl > 0) {

    reward = 1;
  }

  if (pnl < 0) {

    reward = -1;
  }

  // ==========================================
  // SAVE MEMORY
  // ==========================================

  await pool.query(
    `
    INSERT INTO reinforcement_memory
    (
      pattern,
      confidence,
      pnl,
      reward
    )
    VALUES
    ($1,$2,$3,$4)
    `,
    [
      pattern,

      confidence,

      pnl,

      reward,
    ]
  );
}

// ==========================================
// GET REINFORCEMENT SCORE
// ==========================================

async function getReinforcementScore({

  pool,

  pattern,
}) {

  const result =
    await pool.query(
      `
      SELECT
        AVG(reward) AS score
      FROM reinforcement_memory
      WHERE pattern = $1
      `,
      [pattern]
    );

  return Number(
    result.rows[0]?.score || 0
  );
}

module.exports = {

  updateReinforcementMemory,

  getReinforcementScore,
};
