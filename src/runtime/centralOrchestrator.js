const {
  runDiscoveryCycle,
} = require(
  "./discoveryCoordinator"
);

const {
  buildPortfolio,
} = require(
  "./portfolioCoordinator"
);

const {
  runRiskCycle,
} = require(
  "./riskCoordinatorV2"
);

const metrics =
  require(
    "./runtimeMetrics"
  );

async function runCycle() {

  console.log(`
==================================
AUTONOMOUS AI CYCLE
==================================
`);

  const discoveries =
    await runDiscoveryCycle();

  metrics.increment(
    "discoveries"
  );

  const portfolio =
    await buildPortfolio(
      discoveries
    );

  const risk =
    await runRiskCycle({

      drawdown: 0,

      winRate: 50,
    });

  metrics.increment(
    "cycles"
  );

  return {

    discoveries,

    portfolio,

    risk,

    metrics:
      metrics.getMetrics(),

    timestamp:
      new Date()
        .toISOString(),
  };
}

module.exports = {
  runCycle,
};
