"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryConstants = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryConstants");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryMetrics {
  constructor(options = {}) {
    this.namespace =
      options.namespace ||
      PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryConstants.DEFAULT_NAMESPACE;

    this.metrics = {
      registrations: 0,
      unregistrations: 0,
      lookups: 0,
      listings: 0,
      clears: 0,
      errors: 0,
      startedAt: new Date().toISOString()
    };
  }

  increment(metric, value = 1) {
    if (!Object.prototype.hasOwnProperty.call(this.metrics, metric)) {
      return false;
    }

    if (typeof this.metrics[metric] !== "number") {
      return false;
    }

    this.metrics[metric] += value;
    return true;
  }

  get(metric) {
    return this.metrics[metric];
  }

  snapshot() {
    return {
      namespace: this.namespace,
      ...this.metrics,
      timestamp: new Date().toISOString()
    };
  }

  reset() {
    this.metrics.registrations = 0;
    this.metrics.unregistrations = 0;
    this.metrics.lookups = 0;
    this.metrics.listings = 0;
    this.metrics.clears = 0;
    this.metrics.errors = 0;
    this.metrics.startedAt = new Date().toISOString();

    return this.snapshot();
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryMetrics",
      metrics: this.snapshot(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryMetrics;
