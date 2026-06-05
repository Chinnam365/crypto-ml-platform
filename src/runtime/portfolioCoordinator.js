const {
  rotateCapital,
} = require(
  "../ml/portfolioRotationEngine"
);

const {
  optimizePortfolio,
} = require(
  "../ml/portfolioOptimizer"
);

async function buildPortfolio(
  opportunities
) {

  const allocations =
    rotateCapital(
      opportunities
    );

  return optimizePortfolio(
    allocations
  );
}

module.exports = {
  buildPortfolio,
};
