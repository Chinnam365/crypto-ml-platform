"use strict";

const authDiagnostics = require("./authDiagnostics");
const authStatistics = require("./authStatistics");
const authMetrics = require("./authMetrics");
const authorizationAudit = require("./authorizationAudit");
const authEventBus = require("./authEventBus");

class AuthInspector {
  inspect() {
    return {
      timestamp: new Date().toISOString(),
      status: authDiagnostics.health(),
      metrics: authMetrics.snapshot(),
      statistics: authStatistics.getSummary(),
      diagnostics: authDiagnostics.run(),
      audit: authorizationAudit.getStatistics(),
      events: authEventBus.statistics()
    };
  }

  inspectSessions() {
    const metrics = authMetrics.snapshot();

    return {
      activeSessionsEstimate:
        metrics.sessionsCreated -
        metrics.sessionsRevoked -
        metrics.sessionsExpired,

      sessionsCreated:
        metrics.sessionsCreated,

      sessionsRevoked:
        metrics.sessionsRevoked,

      sessionsExpired:
        metrics.sessionsExpired,

      generatedAt:
        new Date().toISOString()
    };
  }

  inspectAuthentication() {
    const metrics = authMetrics.snapshot();

    return {
      loginAttempts:
        metrics.loginAttempts,

      successfulLogins:
        metrics.successfulLogins,

      failedLogins:
        metrics.failedLogins,

      successRate:
        metrics.loginSuccessRate,

      accountLocks:
        metrics.accountLocks,

      generatedAt:
        new Date().toISOString()
    };
  }

  inspectAuthorization() {
    return {
      audit:
        authorizationAudit.getStatistics(),
      recentDenied:
        authorizationAudit.getDenied(20),
      recentGranted:
        authorizationAudit.getGranted(20),
      generatedAt:
        new Date().toISOString()
    };
  }

  inspectEvents() {
    return {
      statistics:
        authEventBus.statistics(),
      recentEvents:
        authEventBus.history(50),
      generatedAt:
        new Date().toISOString()
    };
  }
}

module.exports = new AuthInspector();
