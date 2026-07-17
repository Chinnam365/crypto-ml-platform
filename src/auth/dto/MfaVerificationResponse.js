"use strict";

class MfaVerificationResponse {
  constructor(data = {}) {
    this.success = Boolean(data.success);

    this.message =
      data.message || null;

    this.accessToken =
      data.accessToken || null;

    this.refreshToken =
      data.refreshToken || null;

    this.tokenType =
      data.tokenType || "Bearer";

    this.sessionId =
      data.sessionId || null;

    this.expiresIn =
      data.expiresIn || null;

    this.permissions =
      Array.isArray(data.permissions)
        ? data.permissions
        : [];

    this.serverTime =
      new Date().toISOString();
  }

  static success(data = {}) {
    return new MfaVerificationResponse({
      success: true,
      message:
        "Multi-factor authentication successful.",
      ...data
    });
  }

  static failure(message) {
    return new MfaVerificationResponse({
      success: false,
      message
    });
  }

  toJSON() {
    const response = {
      success: this.success,
      message: this.message,
      tokenType: this.tokenType,
      serverTime: this.serverTime
    };

    if (this.accessToken) {
      response.accessToken =
        this.accessToken;
    }

    if (this.refreshToken) {
      response.refreshToken =
        this.refreshToken;
    }

    if (this.sessionId) {
      response.sessionId =
        this.sessionId;
    }

    if (this.expiresIn !== null) {
      response.expiresIn =
        this.expiresIn;
    }

    if (this.permissions.length) {
      response.permissions =
        this.permissions;
    }

    return response;
  }
}

module.exports = MfaVerificationResponse;
