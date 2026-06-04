function registerDashboardRoutes(
  app
) {

  app.get(
    "/dashboard-status",

    async (
      req,
      res
    ) => {

      res.json({

        status:
          "ACTIVE",

        timestamp:
          new Date()
            .toISOString(),
      });
    }
  );
}

module.exports = {
  registerDashboardRoutes,
};
