"use strict";

const DEFAULT_OPTIONS = Object.freeze({
  maxPasswordAgeDays: 90,
  expiryWarningDays: 14
});

class PasswordExpiryService {
  constructor(options = {}) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options
    };
  }

  getExpiryDate(passwordChangedAt) {
    const changed =
      passwordChangedAt instanceof Date
        ? passwordChangedAt
        : new Date(passwordChangedAt);

    return new Date(
      changed.getTime() +
        this.options.maxPasswordAgeDays *
          24 *
          60 *
          60 *
          1000
    );
  }

  isExpired(passwordChangedAt) {
    return (
      Date.now() >=
      this.getExpiryDate(passwordChangedAt).getTime()
    );
  }

  daysRemaining(passwordChangedAt) {
    const remaining =
      this.getExpiryDate(passwordChangedAt).getTime() -
      Date.now();

    return Math.max(
      0,
      Math.ceil(remaining / (24 * 60 * 60 * 1000))
    );
  }

  shouldWarn(passwordChangedAt) {
    return (
      !this.isExpired(passwordChangedAt) &&
      this.daysRemaining(passwordChangedAt) <=
        this.options.expiryWarningDays
    );
  }

  getStatus(passwordChangedAt) {
    return {
      expired: this.isExpired(passwordChangedAt),
      expiryDate: this.getExpiryDate(
        passwordChangedAt
      ).toISOString(),
      daysRemaining: this.daysRemaining(
        passwordChangedAt
      ),
      warning: this.shouldWarn(
        passwordChangedAt
      )
    };
  }
}

module.exports = PasswordExpiryService;
