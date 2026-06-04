function optimizePortfolio(
  allocations
) {

  return allocations.map(
    asset => {

      let adjusted =
        asset.allocation;

      if (
        adjusted > 30
      ) {

        adjusted = 30;
      }

      return {

        ...asset,

        optimizedAllocation:
          adjusted,
      };
    }
  );
}

module.exports = {
  optimizePortfolio,
};
