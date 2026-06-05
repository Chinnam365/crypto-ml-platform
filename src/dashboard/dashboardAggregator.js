async function buildDashboard({

  portfolio,

  health,

  learning,

  risk,

}) {

  return {

    portfolio,

    health,

    learning,

    risk,

    timestamp:
      new Date()
        .toISOString(),
  };
}

module.exports = {
  buildDashboard,
};
