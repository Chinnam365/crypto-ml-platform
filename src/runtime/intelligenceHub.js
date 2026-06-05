const {
  runLearningCycle,
} = require(
  "./learningRuntimeCoordinator"
);

const {
  runStrategyEvolution,
} = require(
  "./strategyEvolutionRuntime"
);

const {
  runReinforcementCycle,
} = require(
  "./reinforcementRuntime"
);

async function runIntelligenceHub() {

  const learning =
    await runLearningCycle({

      tradesProcessed: 0,

      signalsProcessed: 0,

      strategiesUpdated: 0,
    });

  const reinforcement =
    await runReinforcementCycle({

      symbols: 0,

      rewards: 0,
    });

  const evolution =
    await runStrategyEvolution({

      promoted: 0,

      suppressed: 0,

      retired: 0,
    });

  return {

    learning,

    reinforcement,

    evolution,
  };
}

module.exports = {
  runIntelligenceHub,
};
