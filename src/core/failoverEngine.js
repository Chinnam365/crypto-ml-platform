function evaluateFailover({

  exchangeConnected,

  databaseConnected,

}) {

  if (
    !exchangeConnected
  ) {

    return "EXCHANGE_FAILOVER";
  }

  if (
    !databaseConnected
  ) {

    return "DATABASE_FAILOVER";
  }

  return "HEALTHY";
}

module.exports = {
  evaluateFailover,
};
