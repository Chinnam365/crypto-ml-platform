"use strict";

class PasswordResetProviderRegistryNodeRegistryMetrics {
  constructor() {
    this.reset();
  }

  increment(metric, value = 1) {
    if (typeof this.metrics[metric] !== "number") {
      this.metrics[metric] = 0;
    }

    this.metrics[metric] += value;
    this.metrics.lastUpdated = new Date().toISOString();

    return this.metrics[metric];
  }

  decrement(metric, value = 1) {
    return this.increment(metric, -value);
  }

  set(metric, value) {
    this.metrics[metric] = value;
    this.metrics.lastUpdated = new Date().toISOString();

    return value;
  }

  get(metric) {
    return this.metrics[metric];
  }

  snapshot() {
    return {
      ...this.metrics
    };
  }

  reset() {
    this.metrics = {
      nodesRegistered: 0,
      nodesActive: 0,
      requestsProcessed: 0,
      successfulRequests: 0,
      failedRequests: 0,
      healthChecks: 0,
      registryStarts: 0,
      registryStops: 0,
      lastUpdated: new Date().toISOString()
    };

    return this;
  }

  status() {
    return {
      metrics: "PasswordResetProviderRegistryNodeRegistryMetrics",
      values: this.snapshot(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeRegistryMetrics;
