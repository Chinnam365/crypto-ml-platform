const {
  buildDashboard,
} = require(
  "../dashboard/dashboardAggregator"
);

async function generateDashboard(
  data
) {

  return buildDashboard(
    data
  );
}

module.exports = {
  generateDashboard,
};
