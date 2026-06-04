function findCorrelations(
  symbolPerformance
) {

  const relationships = [];

  for (
    const symbol of symbolPerformance
  ) {

    relationships.push({

      symbol:
        symbol.symbol,

      influence:
        symbol.avgPnL > 0
          ? "POSITIVE"
          : "NEGATIVE",
    });
  }

  return relationships;
}

module.exports = {
  findCorrelations,
};
