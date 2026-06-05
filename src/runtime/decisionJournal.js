class DecisionJournal {

  constructor() {

    this.decisions = [];
  }

  record(
    decision
  ) {

    this.decisions.push({

      ...decision,

      timestamp:
        new Date()
          .toISOString(),
    });
  }

  latest(
    count = 100
  ) {

    return this.decisions
      .slice(-count)
      .reverse();
  }
}

module.exports =
  new DecisionJournal();
