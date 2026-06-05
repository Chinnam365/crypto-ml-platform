class RuntimeMetrics {

  constructor() {

    this.metrics = {

      cycles: 0,

      trades: 0,

      discoveries: 0,

      alerts: 0,
    };
  }

  increment(
    metric
  ) {

    if (
      this.metrics[
        metric
      ] !== undefined
    ) {

      this.metrics[
        metric
      ]++;
    }
  }

  getMetrics() {

    return this.metrics;
  }
}

module.exports =
  new RuntimeMetrics();
