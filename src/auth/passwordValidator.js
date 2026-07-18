"use strict";

const PasswordPolicy = require("./passwordPolicy");
const PasswordStrengthService = require("./passwordStrengthService");

class PasswordValidator {
  constructor(options = {}) {
    this.policy = new PasswordPolicy(options.policy);
    this.strengthService = new PasswordStrengthService();
    this.minimumStrength = options.minimumStrength || "GOOD";

    this.strengthRanking = Object.freeze({
      VERY_WEAK: 1,
      WEAK: 2,
      GOOD: 3,
      STRONG: 4,
      VERY_STRONG: 5
    });
  }

  validate(password) {
    const policyResult = this.policy.validate(password);
    const strengthResult = this.strengthService.evaluate(password);

    const meetsStrength =
      this.strengthRanking[strengthResult.strength] >=
      this.strengthRanking[this.minimumStrength];

    const errors = [...policyResult.errors];

    if (!meetsStrength) {
      errors.push(
        `Password strength must be at least ${this.minimumStrength}.`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
      policy: policyResult,
      strength: strengthResult
    };
  }

  setMinimumStrength(level) {
    if (this.strengthRanking[level]) {
      this.minimumStrength = level;
    }
  }

  getMinimumStrength() {
    return this.minimumStrength;
  }
}

module.exports = PasswordValidator;
