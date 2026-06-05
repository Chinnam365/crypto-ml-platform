class RuntimeEvents {

  constructor() {

    this.events = [];
  }

  register(
    event
  ) {

    this.events.push({

      ...event,

      timestamp:
        new Date()
          .toISOString(),
    });
  }

  latest(
    count = 100
  ) {

    return this.events
      .slice(-count)
      .reverse();
  }
}

module.exports =
  new RuntimeEvents();
