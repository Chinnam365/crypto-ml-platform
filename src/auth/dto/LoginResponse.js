"use strict";

class LoginResponse {
  constructor(data = {}) {
    this.success = Boolean(data.success);

    this.message = data.message || null;

    this.user = data.user || null;

    this.tokens = data.tokens || null;

    this.session = data.session || null;

    this.permissions = Array.isArray(data.permissions)
      ? data.permissions
      : [];

    this.mfaRequired = Boolean(data.mfaRequired);

    this.mfaSetupRequired = Boolean(
      data.mfaSetupRequired
    );

    this.expiresIn = data.expiresIn || null;

    this.serverTime = new Date().toISOString();
  }

  static success({
    user,
    tokens,
    session,
    permissions = [],
    expiresIn
  }) {
    return new LoginResponse({
      success: true,
      message: "Authentication successful.",
      user,
      tokens,
      session,
      permissions,
      expiresIn
    });
  }

  static mfaRequired() {
    return new LoginResponse({
      success: false,
      message: "Multi-factor authentication required.",
      mfaRequired: true
    });
  }

  static mfaSetupRequired(secret, qrCode, backupCodes) {
    return new LoginResponse({
      success: false,
      message: "Multi-factor authentication setup required.",
      mfaSetupRequired: true,
      mfaSecret: secret,
      qrCode,
      backupCodes
    });
  }

  static failure(message) {
    return new LoginResponse({
      success: false,
      message
    });
  }

  toJSON() {
    const response = {
      success: this.success,
      message: this.message,
      serverTime: this.serverTime
    };

    if (this.user) {
      response.user = this.user;
    }

    if (this.tokens) {
      response.tokens = this.tokens;
    }

    if (this.session) {
      response.session = this.session;
    }

    if (this.permissions.length) {
      response.permissions = this.permissions;
    }

    if (this.expiresIn !== null) {
      response.expiresIn = this.expiresIn;
    }

    if (this.mfaRequired) {
      response.mfaRequired = true;
    }

    if (this.mfaSetupRequired) {
      response.mfaSetupRequired = true;
    }

    if (this.qrCode) {
      response.qrCode = this.qrCode;
    }

    if (this.backupCodes) {
      response.backupCodes = this.backupCodes;
    }

    return response;
  }
}

module.exports = LoginResponse;
