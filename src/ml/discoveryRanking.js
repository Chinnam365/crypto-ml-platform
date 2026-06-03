function rankDiscoveries(
  marketData
) {

  const ranked =
    marketData
      .map(coin => {

        const score =

          (
            Math.abs(
              coin.priceChange
            ) * 2
          )

          +

          (
            Math.log10(
              coin.quoteVolume + 1
            ) * 5
          )

          +

          (
            Math.log10(
              coin.trades + 1
            ) * 3
          );

        return {

          ...coin,

          discoveryScore:
            Number(
              score.toFixed(2)
            ),
        };
      })

      .sort(
        (a, b) =>
          b.discoveryScore -
          a.discoveryScore
      )

      .slice(0, 25);

  return ranked;
}

module.exports = {
  rankDiscoveries,
};
