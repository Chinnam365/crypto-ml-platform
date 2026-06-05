function buildAuditDashboard({

  decisions,

  models,

  alerts,

}) {

  return {

    decisions,

    models,

    alerts,

    timestamp:
      new Date()
        .toISOString(),
  };
}

module.exports = {
  buildAuditDashboard,
};
