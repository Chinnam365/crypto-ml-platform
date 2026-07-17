"use strict";

class LogoutRequest {
  constructor(body = {}) {
    this.sessionId =
      typeof body.sessionId === "string"
        ? body.sessionId.trim()
        : "";

    this.refreshToken =
      typeof body.refreshToken === "string"
        ? body.refreshToken.trim()
        : "";

    this.logoutAllDevices =
      Boolean(body.logoutAllDevices);

    this.reason =
      typeof body.reason === "string"
        ? body.reason.trim()
        : "USER_REQUEST";
  }

  validate() {
    const errors = [];

    if (
      !this.sessionId &&
      !this.refreshToken
    ) {
      errors.push(
        "Either sessionId or refreshToken is required."
      );
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      sessionId: this.sessionId,
      refreshToken: this.refreshToken
        ? "[REDACTED]"
        : null,
      logoutAllDevices: this.logoutAllDevices,
      reason: this.reason
    };
  }
}

module.exports = LogoutRequest;
