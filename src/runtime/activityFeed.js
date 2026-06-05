const events =
  require(
    "./runtimeEvents"
  );

function getActivityFeed() {

  return events.latest(
    100
  );
}

module.exports = {
  getActivityFeed,
};
