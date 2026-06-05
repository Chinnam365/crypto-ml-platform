function buildExecutionPlan({

  opportunities,

  allocations,

}) {

  return opportunities.map(

    opportunity => ({

      symbol:
        opportunity.symbol,

      allocation:

        allocations.find(

          allocation =>

            allocation.symbol ===
            opportunity.symbol
        ),

      approved:
        true,
    })
  );
}

module.exports = {
  buildExecutionPlan,
};
