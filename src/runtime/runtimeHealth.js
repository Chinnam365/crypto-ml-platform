function buildRuntimeHealth({

  runtime,

  discovery,

  risk,

  learning,

}) {

  return {

    runtime,

    discovery,

    risk,

    learning,

    status:
      "HEALTHY",

    timestamp:
      new Date()
        .toISOString(),
  };
}

module.exports = {
  buildRuntimeHealth,
};
