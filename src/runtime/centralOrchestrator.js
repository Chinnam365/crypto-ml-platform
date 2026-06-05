const runtime =
  require("./aiRuntime");

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

async function runCycle() {

  const discoveries =
    await runDiscoveryCycle();

  const portfolio =
    await buildPortfolio(
      discoveries
    );

  return {

    discoveries,

    portfolio,

    timestamp:
      new Date()
        .toISOString(),
  };
}

module.exports = {
  runCycle,
};
