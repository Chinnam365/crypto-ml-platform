"use strict";

class PasswordResetMetrics {
  constructor() {
    this.reset();
  }

  recordTokenCreated() {
    this.metrics.tokensCreated++;
    this.metrics.lastUpdated = new Date().toISOString();
  }

  recordTokenValidated(success = true) {
    if (success) {
      this.metrics.validationsPassed++;
    } else {
      this.metrics.validationsFailed++;
    }

    this.metrics.lastUpdated = new Date().toISOString();
  }

  recordTokenConsumed(success = true) {
    if (success) {
      this.metrics.tokensConsumed++;
    } else {
      this.metrics.consumeFailures++;
    }

    this.metrics.lastUpdated = new Date().toISOString();
  }

  recordTokenRevoked() {
    this.metrics.tokensRevoked++;
    this.metrics.lastUpdated = new Date().toISOString();
  }

  recordTokenExpired() {
    this.metrics.tokensExpired++;
    this.metrics.lastUpdated = new Date().toISOString();
  }

  recordCleanup(removedCount = 0) {
    this.metrics.cleanupRuns++;
    this.metrics.tokensRemovedByCleanup += removedCount;
    this.metrics.lastUpdated = new Date().toISOString();
  }

  snapshot() {
    return {
      ...this.metrics
    };
  }

  reset() {
    this.metrics = {
      tokensCreated: 0,
      validationsPassed: 0,
      validationsFailed: 0,
      tokensConsumed: 0,
      consumeFailures: 0,
      tokensRevoked: 0,
      tokensExpired: 0,
      cleanupRuns: 0,
      tokensRemovedByCleanup: 0,
      startedAt: new Date().toISOString(),
      lastUpdated: null
    };
  }
}

module.exports = PasswordResetMetrics;
