async function runWalkForward({

  trainingData,

  testingData,

}) {

  return {

    trainingSamples:
      trainingData.length,

    testingSamples:
      testingData.length,

    status:
      "COMPLETE",

    timestamp:
      new Date()
        .toISOString(),
  };
}

module.exports = {
  runWalkForward,
};
