"use strict";

class PasswordResetValidator {
  validateCreate(request = {}) {
    const errors = [];

    if (!request.userId) {
      errors.push("userId is required.");
    }

    return this.buildResult(errors);
  }

  validateConsume(request = {}) {
    const errors = [];

    if (!request.token) {
      errors.push("token is required.");
    }

    if (!request.newPassword) {
      errors.push("newPassword is required.");
    }

    return this.buildResult(errors);
  }

  validateToken(request = {}) {
    const errors = [];

    if (!request.token) {
      errors.push("token is required.");
    }

    return this.buildResult(errors);
  }

  validateRevoke(request = {}) {
    const errors = [];

    if (!request.token) {
      errors.push("token is required.");
    }

    return this.buildResult(errors);
  }

  buildResult(errors) {
    return {
      valid: errors.length === 0,
      errors
    };
  }
}

module.exports = PasswordResetValidator;
