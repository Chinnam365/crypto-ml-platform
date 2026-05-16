async function getAccountStats(pool) {

  const result =
    await pool.query(`
      SELECT *
      FROM positions
    `);

  const positions =
    result.rows;

  let startingBalance = 10000;

  let realizedPnL = 0;

  let unrealizedPnL = 0;

  let usedCapital = 0;

  positions.forEach(position => {

    const pnl =
      Number(position.pnl || 0);

    if (
      position.status === "CLOSED"
    ) {

      realizedPnL += pnl;
    }

    if (
      position.status === "OPEN"
    ) {

      unrealizedPnL += pnl;

      usedCapital +=
        Number(
          position.position_size || 0
        );
    }
  });

  const equity =
    startingBalance +
    realizedPnL +
    unrealizedPnL;

  const availableCapital =
    equity - usedCapital;

  return {

    startingBalance,

    realizedPnL:
      Number(
        realizedPnL.toFixed(2)
      ),

    unrealizedPnL:
      Number(
        unrealizedPnL.toFixed(2)
      ),

    equity:
      Number(
        equity.toFixed(2)
      ),

    usedCapital:
      Number(
        usedCapital.toFixed(2)
      ),

    availableCapital:
      Number(
        availableCapital.toFixed(2)
      ),
  };
}

module.exports = {
  getAccountStats,
};
