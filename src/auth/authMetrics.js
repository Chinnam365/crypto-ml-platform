"use strict";

class AuthMetrics {
  constructor() {
    this.reset();
  }

  reset() {
    this.metrics = {
      loginAttempts: 0,
      successfulLogins: 0,
      failedLogins: 0,

      logoutCount: 0,

      accessTokensIssued: 0,
      refreshTokensIssued: 0,
      refreshOperations: 0,

      sessionsCreated: 0,
      sessionsRevoked: 0,
      sessionsExpired: 0,

      mfaChallenges: 0,
      mfaSuccesses: 0,
      mfaFailures: 0,

      authorizationGranted: 0,
      authorizationDenied: 0,

      accountLocks: 0,

      startedAt: new Date().toISOString()
    };
  }

  increment(metric, amount = 1) {
    if (!(metric in this.metrics)) {
      return;
    }

    this.metrics[metric] += amount;
  }

  loginAttempt() {
    this.increment("loginAttempts");
  }

  loginSuccess() {
    this.increment("successfulLogins");
  }

  loginFailure() {
    this.increment("failedLogins");
  }

  logout() {
    this.increment("logoutCount");
  }

  accessTokenIssued() {
    this.increment("accessTokensIssued");
  }

  refreshTokenIssued() {
    this.increment("refreshTokensIssued");
  }

  refreshOperation() {
    this.increment("refreshOperations");
  }

  sessionCreated() {
    this.increment("sessionsCreated");
  }

  sessionRevoked() {
    this.increment("sessionsRevoked");
  }

  sessionExpired() {
    this.increment("sessionsExpired");
  }

  mfaChallenge() {
    this.increment("mfaChallenges");
  }

  mfaSuccess() {
    this.increment("mfaSuccesses");
  }

  mfaFailure() {
    this.increment("mfaFailures");
  }

  authorizationGranted() {
    this.increment("authorizationGranted");
  }

  authorizationDenied() {
    this.increment("authorizationDenied");
  }

  accountLocked() {
    this.increment("accountLocks");
  }

  snapshot() {
    const m = this.metrics;

    return {
      ...m,

      loginSuccessRate:
        m.loginAttempts === 0
          ? 0
          : Number(
              (
                (m.successfulLogins /
                  m.loginAttempts) *
                100
              ).toFixed(2)
            ),

      mfaSuccessRate:
        m.mfaChallenges === 0
          ? 0
          : Number(
              (
                (m.mfaSuccesses /
                  m.mfaChallenges) *
                100
              ).toFixed(2)
            ),

      authorizationSuccessRate:
        m.authorizationGranted +
          m.authorizationDenied ===
        0
          ? 0
          : Number(
              (
                (m.authorizationGranted /
                  (m.authorizationGranted +
                    m.authorizationDenied)) *
                100
              ).toFixed(2)
            ),

      generatedAt: new Date().toISOString()
    };
  }
}

module.exports = new AuthMetrics();
