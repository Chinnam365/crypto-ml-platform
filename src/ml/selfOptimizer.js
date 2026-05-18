async function getOptimizationAdjustments(pool) {

  const result =
    await pool.query(`
      SELECT
        AVG(pnl) AS avg_pnl,
        AVG(confidence) AS avg_confidence,
        AVG(reward) AS avg_reward
      FROM reinforcement_memory
    `);

  const row =
    result.rows[0];

  const avgPnL =
    Number(row.avg_pnl || 0);

  const avgConfidence =
    Number(
      row.avg_confidence || 0
    );

  const avgReward =
    Number(row.avg_reward || 0);

  let thresholdAdjustment = 0;

  let confidenceMultiplier = 1;

  // ==========================================
  // PERFORMANCE LOGIC
  // ==========================================

  if (avgReward > 0.3) {

    thresholdAdjustment -= 3;

    confidenceMultiplier += 0.05;
  }

  if (avgReward < -0.3) {

    thresholdAdjustment += 3;

    confidenceMultiplier -= 0.05;
  }

  return {

    avgPnL,

    avgConfidence,

    avgReward,

    thresholdAdjustment,

    confidenceMultiplier,
  };
}

module.exports = {
  getOptimizationAdjustments,
};
