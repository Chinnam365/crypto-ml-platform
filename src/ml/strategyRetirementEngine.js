async function retireStrategies(
  strategies
) {

  const retired = [];

  const active = [];

  for (
    const strategy of strategies
  ) {

    if (
      strategy.evolutionScore < -150 &&
      strategy.trades > 20
    ) {

      retired.push({

        ...strategy,

        status:
          "RETIRED",
      });

      continue;
    }

    active.push(
      strategy
    );
  }

  return {

    active,

    retired,
  };
}

module.exports = {
  retireStrategies,
};
