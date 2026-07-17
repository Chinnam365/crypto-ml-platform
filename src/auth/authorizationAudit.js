"use strict";

const logger = require("../config/logger");

class AuthorizationAudit {
  constructor() {
    this.history = [];
    this.maxHistory = 10000;
  }

  record({
    userId = null,
    role = null,
    permission = null,
    resource = null,
    action = null,
    granted = false,
    ipAddress = null,
    userAgent = null,
    reason = null
  }) {
    const event = {
      timestamp: new Date().toISOString(),
      userId,
      role,
      permission,
      resource,
      action,
      granted,
      ipAddress,
      userAgent,
      reason
    };

    this.history.push(event);

    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    logger.info({
      event: "AUTHORIZATION_AUDIT",
      authorization: event
    });

    return event;
  }

  getHistory(limit = 100) {
    return this.history.slice(-limit);
  }

  getDenied(limit = 100) {
    return this.history
      .filter(event => !event.granted)
      .slice(-limit);
  }

  getGranted(limit = 100) {
    return this.history
      .filter(event => event.granted)
      .slice(-limit);
  }

  clear() {
    this.history = [];
  }

  getStatistics() {
    const granted = this.history.filter(
      e => e.granted
    ).length;

    const denied =
      this.history.length - granted;

    return {
      total: this.history.length,
      granted,
      denied,
      grantRate:
        this.history.length === 0
          ? 0
          : Number(
              (
                (granted / this.history.length) *
                100
              ).toFixed(2)
            )
    };
  }
}

module.exports = new AuthorizationAudit();
