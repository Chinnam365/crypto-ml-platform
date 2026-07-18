"use strict";

class PasswordResetProviderMetrics {
  constructor() {
    this.metrics = new Map();
  }

  register(providerName) {
    if (!this.metrics.has(providerName)) {
      this.metrics.set(providerName, {
        sent: 0,
        failed: 0,
        lastSentAt: null,
        lastFailureAt: null
      });
    }

    return this.metrics.get(providerName);
  }

  recordSuccess(providerName) {
    const metric = this.register(providerName);

    metric.sent++;
    metric.lastSentAt = new Date().toISOString();
  }

  recordFailure(providerName) {
    const metric = this.register(providerName);

    metric.failed++;
    metric.lastFailureAt = new Date().toISOString();
  }

  get(providerName) {
    return this.metrics.get(providerName) || null;
  }

  getAll() {
    return Array.from(this.metrics.entries()).map(
      ([provider, metric]) => ({
        provider,
        ...metric
      })
    );
  }

  reset(providerName) {
    if (providerName) {
      this.metrics.delete(providerName);
      return;
    }

    this.metrics.clear();
  }

  summary() {
    const summary = {
      providers: this.metrics.size,
      sent: 0,
      failed: 0
    };

    for (const metric of this.metrics.values()) {
      summary.sent += metric.sent;
      summary.failed += metric.failed;
    }

    return summary;
  }
}

module.exports = PasswordResetProviderMetrics;
