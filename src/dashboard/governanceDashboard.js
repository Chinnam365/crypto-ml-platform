function buildGovernanceDashboard({

  activeModels,

  retiredStrategies,

  riskLevel,

}) {

  return {

    activeModels,

    retiredStrategies,

    riskLevel,

    status:
      "COMPLIANT",

    timestamp:
      new Date()
        .toISOString(),
  };
}

module.exports = {
  buildGovernanceDashboard,
};
