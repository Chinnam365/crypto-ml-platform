"use strict";

class LogoutResponse {
  constructor(data = {}) {
    this.success = Boolean(data.success);

    this.message = data.message || null;

    this.sessionId =
      data.sessionId || null;

    this.sessionsRevoked =
      Number(data.sessionsRevoked || 0);

    this.loggedOutAllDevices =
      Boolean(data.loggedOutAllDevices);

    this.serverTime =
      new Date().toISOString();
  }

  static success({
    sessionId = null,
    sessionsRevoked = 1,
    loggedOutAllDevices = false
  } = {}) {
    return new LogoutResponse({
      success: true,
      message: "Logout completed successfully.",
      sessionId,
      sessionsRevoked,
      loggedOutAllDevices
    });
  }

  static failure(message) {
    return new LogoutResponse({
      success: false,
      message
    });
  }

  toJSON() {
    const response = {
      success: this.success,
      message: this.message,
      serverTime: this.serverTime,
      sessionsRevoked: this.sessionsRevoked,
      loggedOutAllDevices:
        this.loggedOutAllDevices
    };

    if (this.sessionId) {
      response.sessionId =
        this.sessionId;
    }

    return response;
  }
}

module.exports = LogoutResponse;
