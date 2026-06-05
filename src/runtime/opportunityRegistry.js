class OpportunityRegistry {

  constructor() {

    this.opportunities =
      [];
  }

  register(
    opportunity
  ) {

    this.opportunities.push(
      opportunity
    );
  }

  getTop(
    count = 10
  ) {

    return this.opportunities

      .sort(
        (a, b) =>
          b.aiScore -
          a.aiScore
      )

      .slice(
        0,
        count
      );
  }
}

module.exports =
  new OpportunityRegistry();
