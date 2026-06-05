function simulatePortfolio({

  capital,

  allocations,

}) {

  return allocations.map(

    asset => ({

      symbol:
        asset.symbol,

      capital:

        Number(

          (
            capital *

            (
              asset.allocation /
              100
            )
          ).toFixed(2)
        ),
    })
  );
}

module.exports = {
  simulatePortfolio,
};
