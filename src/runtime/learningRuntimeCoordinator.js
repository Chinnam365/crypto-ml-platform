async function runLearningCycle({

  tradesProcessed,

  signalsProcessed,

  strategiesUpdated,

}) {

  console.log(`
==================================
LEARNING CYCLE
==================================
Trades:
${tradesProcessed}

Signals:
${signalsProcessed}

Strategies:
${strategiesUpdated}
==================================
`);

  return {

    tradesProcessed,

    signalsProcessed,

    strategiesUpdated,

    timestamp:
      new Date()
        .toISOString(),
  };
}

module.exports = {
  runLearningCycle,
};
