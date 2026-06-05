function allocateCapital({

  capital,

  allocations,

}) {

  return allocations.map(

    allocation => ({

      symbol:
        allocation.symbol,

      capital:

        Number(

          (

            capital *

            (
              allocation.optimizedAllocation /
              100
            )

          ).toFixed(2)
        ),
    })
  );
}

module.exports = {
  allocateCapital,
};
