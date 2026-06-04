async function runSimulation({

  startingCapital,

  trades,

}) {

  return {

    startingCapital,

    trades,

    endingCapital:
      startingCapital,

    status:
      "COMPLETE",
  };
}

module.exports = {
  runSimulation,
};
