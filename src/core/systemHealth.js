function getSystemHealth({

  exchange,

  database,

  ai,

}) {

  if (
    !exchange ||
    !database ||
    !ai
  ) {

    return "WARNING";
  }

  return "HEALTHY";
}

module.exports = {
  getSystemHealth,
};
