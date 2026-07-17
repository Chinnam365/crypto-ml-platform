"use strict";

const authMetrics = require("./authMetrics");
const authStatistics = require("./authStatistics");
const authorizationAudit = require("./authorizationAudit");
const authEventBus = require("./authEventBus");

class AuthDiagnostics {
  run() {
    const metrics = authMetrics.snapshot();
    const authorization =
      authorizationAudit.getStatistics();
    const events =
      authEventBus.statistics();

    return {
      status: this.calculateOverallStatus(
        metrics,
        authorization
      ),

      timestamp: new Date().toISOString(),

      checks: {
        metrics: this.checkMetrics(metrics),
        authorization:
          this.checkAuthorization(
            authorization
          ),
        events: this.checkEvents(events)
      },

      summary:
        authStatistics.getSummary()
    };
  }

  calculateOverallStatus(
    metrics,
    authorization
  ) {
    if (
      metrics.accountLocks > 10 ||
      metrics.loginSuccessRate < 25
    ) {
      return "CRITICAL";
    }

    if (
      authorization.denied >
      authorization.granted
    ) {
      return "WARNING";
    }

    return "HEALTHY";
  }

  checkMetrics(metrics) {
    return {
      healthy:
        metrics.loginSuccessRate >= 50,
      loginAttempts:
        metrics.loginAttempts,
      loginSuccessRate:
        metrics.loginSuccessRate,
      mfaSuccessRate:
        metrics.mfaSuccessRate
    };
  }

  checkAuthorization(stats) {
    return {
      healthy:
        stats.denied <= stats.granted,
      granted: stats.granted,
      denied: stats.denied,
      successRate: stats.grantRate
    };
  }

  checkEvents(events) {
    return {
      healthy: true,
      totalEvents:
        events.totalEvents,
      eventTypes:
        events.eventTypes
    };
  }

  health() {
    return {
      status:
        this.run().status,
      generatedAt:
        new Date().toISOString()
    };
  }
}

module.exports = new AuthDiagnostics();
