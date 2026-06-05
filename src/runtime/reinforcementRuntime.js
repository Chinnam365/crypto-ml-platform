async function runReinforcementCycle({

  symbols,

  rewards,

}) {

  return {

    symbols,

    rewards,

    updated:
      true,

    timestamp:
      new Date()
        .toISOString(),
  };
}

module.exports = {
  runReinforcementCycle,
};
