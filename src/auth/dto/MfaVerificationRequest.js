"use strict";

class MfaVerificationRequest {
  constructor(body = {}) {
    this.sessionId =
      typeof body.sessionId === "string"
        ? body.sessionId.trim()
        : "";

    this.code =
      typeof body.code === "string"
        ? body.code.replace(/\s+/g, "")
        : "";

    this.backupCode =
      typeof body.backupCode === "string"
        ? body.backupCode.replace(/\s+/g, "")
        : "";

    this.rememberDevice =
      Boolean(body.rememberDevice);

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

    if (!this.sessionId) {
      errors.push("Session ID is required.");
    }

    if (!this.code && !this.backupCode) {
      errors.push(
        "MFA code or backup code is required."
      );
    }

    if (
      this.code &&
      !/^\d{6}$/.test(this.code)
    ) {
      errors.push(
        "Authenticator code must contain exactly 6 digits."
      );
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  usingBackupCode() {
    return (
      this.backupCode.length > 0
    );
  }

  toJSON() {
    return {
      sessionId: this.sessionId,
      code: this.code
        ? "[REDACTED]"
        : null,
      backupCode: this.backupCode
        ? "[REDACTED]"
        : null,
      rememberDevice: this.rememberDevice,
      deviceId: this.deviceId,
      deviceName: this.deviceName
    };
  }
}

module.exports = MfaVerificationRequest;
