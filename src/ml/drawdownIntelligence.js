async function getDrawdownState(pool) {

  const result =
    await pool.query(`
      SELECT pnl
      FROM positions
      WHERE status = 'CLOSED'
      ORDER BY closed_at DESC
      LIMIT 50
    `);

  const rows =
    result.rows;

  let cumulativePnL = 0;

  let peakPnL = 0;

  let maxDrawdown = 0;

  rows.reverse().forEach(row => {

    cumulativePnL +=
      Number(row.pnl || 0);

    if (
      cumulativePnL >
      peakPnL
    ) {

      peakPnL =
        cumulativePnL;
    }

    const drawdown =
      peakPnL -
      cumulativePnL;

    if (
      drawdown >
      maxDrawdown
    ) {

      maxDrawdown =
        drawdown;
    }
  });

  // ==========================================
  // DETERMINE RISK MODE
  // ==========================================

  let riskMode =
    "NORMAL";

  if (maxDrawdown > 500) {

    riskMode =
      "DEFENSIVE";
  }

  if (maxDrawdown > 1000) {

    riskMode =
      "PROTECTIVE";
  }

  if (maxDrawdown > 2000) {

    riskMode =
      "LOCKDOWN";
  }

  console.log(`
==================================
DRAWDOWN INTELLIGENCE
==================================

Max Drawdown:
${maxDrawdown.toFixed(2)}

Risk Mode:
${riskMode}

==================================
`);

  return {

    maxDrawdown,

    riskMode,
  };
}

module.exports = {
  getDrawdownState,
};
