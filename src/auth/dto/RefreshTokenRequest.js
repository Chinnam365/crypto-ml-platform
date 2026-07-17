"use strict";

class RefreshTokenRequest {
  constructor(body = {}) {
    this.refreshToken =
      typeof body.refreshToken === "string"
        ? body.refreshToken.trim()
        : "";

    this.sessionId =
      typeof body.sessionId === "string"
        ? body.sessionId.trim()
        : "";

    this.deviceId =
      typeof body.deviceId === "string"
        ? body.deviceId.trim()
        : "";

    this.deviceName =
      typeof body.deviceName === "string"
        ? body.deviceName.trim()
        : "";
  }

  validate() {
    const errors = [];

    if (!this.refreshToken) {
      errors.push("Refresh token is required.");
    }

    if (
      this.refreshToken &&
      this.refreshToken.length < 32
    ) {
      errors.push("Invalid refresh token.");
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      refreshToken: "[REDACTED]",
      sessionId: this.sessionId,
      deviceId: this.deviceId,
      deviceName: this.deviceName
    };
  }
}

module.exports = RefreshTokenRequest;
