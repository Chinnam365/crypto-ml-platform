"use strict";

const crypto = require("crypto");

class PasswordResetService {
  constructor(options = {}) {
    this.tokenLength = options.tokenLength || 32;
    this.expiryMinutes = options.expiryMinutes || 30;
    this.tokens = new Map();
  }

  create(userId) {
    const token = crypto
      .randomBytes(this.tokenLength)
      .toString("hex");

    const expiresAt = Date.now() + this.expiryMinutes * 60 * 1000;

    this.tokens.set(token, {
      userId,
      createdAt: new Date().toISOString(),
      expiresAt,
      used: false
    });

    return {
      token,
      expiresAt: new Date(expiresAt).toISOString()
    };
  }

  validate(token) {
    const record = this.tokens.get(token);

    if (!record) {
      return {
        valid: false,
        reason: "TOKEN_NOT_FOUND"
      };
    }

    if (record.used) {
      return {
        valid: false,
        reason: "TOKEN_ALREADY_USED"
      };
    }

    if (Date.now() > record.expiresAt) {
      this.tokens.delete(token);

      return {
        valid: false,
        reason: "TOKEN_EXPIRED"
      };
    }

    return {
      valid: true,
      userId: record.userId
    };
  }

  consume(token) {
    const validation = this.validate(token);

    if (!validation.valid) {
      return validation;
    }

    const record = this.tokens.get(token);
    record.used = true;

    return {
      valid: true,
      userId: record.userId
    };
  }

  revoke(token) {
    return this.tokens.delete(token);
  }

  revokeUserTokens(userId) {
    for (const [token, record] of this.tokens.entries()) {
      if (record.userId === userId) {
        this.tokens.delete(token);
      }
    }
  }

  cleanup() {
    const now = Date.now();

    for (const [token, record] of this.tokens.entries()) {
      if (record.expiresAt <= now || record.used) {
        this.tokens.delete(token);
      }
    }
  }

  count() {
    return this.tokens.size;
  }
}

module.exports = PasswordResetService;
