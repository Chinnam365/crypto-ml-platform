class RuntimeState {

  constructor() {

    this.state = {

      mode:
        "AUTONOMOUS",

      status:
        "ACTIVE",

      exchange:
        "PAPER",

      market:
        "UNKNOWN",
    };
  }

  setState(
    key,
    value
  ) {

    this.state[key] =
      value;
  }

  getState() {

    return this.state;
  }
}

module.exports =
  new RuntimeState();
