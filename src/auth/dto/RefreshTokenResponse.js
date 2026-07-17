"use strict";

class RefreshTokenResponse {
  constructor(data = {}) {
    this.success = Boolean(data.success);

    this.message = data.message || null;

    this.accessToken =
      data.accessToken || null;

    this.refreshToken =
      data.refreshToken || null;

    this.tokenType =
      data.tokenType || "Bearer";

    this.expiresIn =
      data.expiresIn || null;

    this.refreshExpiresIn =
      data.refreshExpiresIn || null;

    this.sessionId =
      data.sessionId || null;

    this.serverTime =
      new Date().toISOString();
  }

  static success(data) {
    return new RefreshTokenResponse({
      success: true,
      message: "Token refreshed successfully.",
      ...data
    });
  }

  static failure(message) {
    return new RefreshTokenResponse({
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
      response.accessToken = this.accessToken;
    }

    if (this.refreshToken) {
      response.refreshToken = this.refreshToken;
    }

    if (this.expiresIn !== null) {
      response.expiresIn = this.expiresIn;
    }

    if (this.refreshExpiresIn !== null) {
      response.refreshExpiresIn =
        this.refreshExpiresIn;
    }

    if (this.sessionId) {
      response.sessionId =
        this.sessionId;
    }

    return response;
  }
}

module.exports = RefreshTokenResponse;
