"use strict";

class LoginRequest {
  constructor(body = {}) {
    this.email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    this.password =
      typeof body.password === "string"
        ? body.password
        : "";

    this.mfaCode =
      typeof body.mfaCode === "string"
        ? body.mfaCode.trim()
        : "";

    this.rememberMe =
      Boolean(body.rememberMe);

    this.deviceName =
      typeof body.deviceName === "string"
        ? body.deviceName.trim()
        : "";

    this.deviceId =
      typeof body.deviceId === "string"
        ? body.deviceId.trim()
        : "";
  }

  validate() {
    const errors = [];

    if (!this.email) {
      errors.push("Email is required.");
    }

    if (
      this.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)
    ) {
      errors.push("Invalid email address.");
    }

    if (!this.password) {
      errors.push("Password is required.");
    }

    if (
      this.password &&
      this.password.length < 8
    ) {
      errors.push(
        "Password must contain at least 8 characters."
      );
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      email: this.email,
      password: "[REDACTED]",
      mfaCode: this.mfaCode
        ? "[REDACTED]"
        : null,
      rememberMe: this.rememberMe,
      deviceName: this.deviceName,
      deviceId: this.deviceId
    };
  }
}

module.exports = LoginRequest;
