const MAX_DRAWDOWN = 15;

async function getDrawdownStats(pool) {

  const result = await pool.query(`
    SELECT pnl
    FROM positions
    ORDER BY id ASC
  `);

  const trades = result.rows;

  let equity = 10000;

  let peakEquity = equity;

  let maxDrawdown = 0;

  for (const trade of trades) {

    equity += Number(trade.pnl || 0);

    if (equity > peakEquity) {

      peakEquity = equity;
    }

    const drawdown =
      (
        (peakEquity - equity)
        / peakEquity
      ) * 100;

    if (drawdown > maxDrawdown) {

      maxDrawdown = drawdown;
    }
  }

  let riskMultiplier = 1;

  let tradingEnabled = true;

  if (maxDrawdown >= 5) {

    riskMultiplier = 0.75;
  }

  if (maxDrawdown >= 10) {

    riskMultiplier = 0.5;
  }

  if (maxDrawdown >= MAX_DRAWDOWN) {

    tradingEnabled = false;
  }

  return {

    equity:
      Number(equity.toFixed(2)),

    peakEquity:
      Number(peakEquity.toFixed(2)),

    maxDrawdown:
      Number(maxDrawdown.toFixed(2)),

    riskMultiplier,

    tradingEnabled,
  };
}

module.exports = {
  getDrawdownStats,
};
