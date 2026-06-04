async function runWorkflow({

  discovery,

  ranking,

  allocation,

  execution,

}) {

  return {

    discovery,

    ranking,

    allocation,

    execution,

    status:
      "COMPLETE",

    timestamp:
      new Date()
        .toISOString(),
  };
}

module.exports = {
  runWorkflow,
};
