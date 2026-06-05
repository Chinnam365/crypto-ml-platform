const runtime =
  require(
    "./aiRuntime"
  );

const metrics =
  require(
    "./runtimeMetrics"
  );

function registerRuntimeRoutes(
  app
) {

  app.get(
    "/runtime-status",

    async (
      req,
      res
    ) => {

      res.json(
        runtime.getStatus()
      );
    }
  );

  app.get(
    "/runtime-metrics",

    async (
      req,
      res
    ) => {

      res.json(
        metrics.getMetrics()
      );
    }
  );
}

module.exports = {
  registerRuntimeRoutes,
};
