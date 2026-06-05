const runtime =
  require(
    "./aiRuntime"
  );

const metrics =
  require(
    "./runtimeMetrics"
  );

function getRuntimeDashboard() {

  return {

    runtime:
      runtime.getStatus(),

    metrics:
      metrics.getMetrics(),

    timestamp:
      new Date()
        .toISOString(),
  };
}

module.exports = {
  getRuntimeDashboard,
};
