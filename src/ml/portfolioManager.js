const MAX_PORTFOLIO_EXPOSURE = 100;

const MAX_OPEN_POSITIONS = 5;

async function getPortfolioStats(pool) {

  const result = await pool.query(`
    SELECT *
    FROM positions
    WHERE status = 'OPEN'
  `);

  const positions = result.rows;

  let totalExposure = 0;

 positions.forEach(position => {

  const size =
    Number(
      position.position_size || 0
    );

  if (!isNaN(size)) {

    totalExposure += size;
  }
});

  return {

    openPositions:
      positions.length,

    totalExposure:
      Number(
        totalExposure.toFixed(4)
      ),

    canTrade:

      positions.length <
        MAX_OPEN_POSITIONS &&

      totalExposure <
        MAX_PORTFOLIO_EXPOSURE,
  };
}

module.exports = {
  getPortfolioStats,
};
