"use strict";

const DEFAULT_POLICY = Object.freeze({
  minLength: 12,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialCharacter: true,
  preventWhitespace: true
});

class PasswordPolicy {
  constructor(policy = {}) {
    this.policy = {
      ...DEFAULT_POLICY,
      ...policy
    };
  }

  validate(password) {
    const errors = [];

    if (typeof password !== "string") {
      return {
        valid: false,
        errors: ["Password must be a string."]
      };
    }

    if (password.length < this.policy.minLength) {
      errors.push(
        `Password must contain at least ${this.policy.minLength} characters.`
      );
    }

    if (password.length > this.policy.maxLength) {
      errors.push(
        `Password must not exceed ${this.policy.maxLength} characters.`
      );
    }

    if (
      this.policy.requireUppercase &&
      !/[A-Z]/.test(password)
    ) {
      errors.push(
        "Password must contain at least one uppercase letter."
      );
    }

    if (
      this.policy.requireLowercase &&
      !/[a-z]/.test(password)
    ) {
      errors.push(
        "Password must contain at least one lowercase letter."
      );
    }

    if (
      this.policy.requireNumber &&
      !/[0-9]/.test(password)
    ) {
      errors.push(
        "Password must contain at least one number."
      );
    }

    if (
      this.policy.requireSpecialCharacter &&
      !/[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]/.test(password)
    ) {
      errors.push(
        "Password must contain at least one special character."
      );
    }

    if (
      this.policy.preventWhitespace &&
      /\s/.test(password)
    ) {
      errors.push(
        "Password must not contain whitespace."
      );
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  getPolicy() {
    return {
      ...this.policy
    };
  }
}

module.exports = PasswordPolicy;
