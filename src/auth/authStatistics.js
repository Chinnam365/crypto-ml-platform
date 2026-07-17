"use strict";

const authMetrics = require("./authMetrics");
const authorizationAudit = require("./authorizationAudit");
const authEventBus = require("./authEventBus");

class AuthStatistics {
  getSummary() {
    return {
      metrics: authMetrics.snapshot(),
      authorization:
        authorizationAudit.getStatistics(),
      events: authEventBus.statistics(),
      generatedAt: new Date().toISOString()
    };
  }

  getHealth() {
    const metrics = authMetrics.snapshot();

    return {
      status: this.calculateStatus(metrics),
      uptimeStarted: metrics.startedAt,
      loginSuccessRate: metrics.loginSuccessRate,
      mfaSuccessRate: metrics.mfaSuccessRate,
      authorizationSuccessRate:
        metrics.authorizationSuccessRate,
      generatedAt: new Date().toISOString()
    };
  }

  calculateStatus(metrics) {
    if (
      metrics.loginAttempts >= 20 &&
      metrics.loginSuccessRate < 20
    ) {
      return "CRITICAL";
    }

    if (
      metrics.authorizationDenied >
      metrics.authorizationGranted
    ) {
      return "WARNING";
    }

    if (
      metrics.accountLocks > 5
    ) {
      return "WARNING";
    }

    return "HEALTHY";
  }

  export() {
    return {
      summary: this.getSummary(),
      health: this.getHealth(),
      auditHistory:
        authorizationAudit.getHistory(100),
      eventHistory:
        authEventBus.history(100)
    };
  }

  reset() {
    authMetrics.reset();
    authorizationAudit.clear();
    authEventBus.clearHistory();

    return {
      success: true,
      message:
        "Authentication statistics reset successfully.",
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new AuthStatistics();
