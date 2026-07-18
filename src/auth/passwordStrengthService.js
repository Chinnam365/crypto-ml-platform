"use strict";

class PasswordStrengthService {
  evaluate(password = "") {
    const checks = {
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]/.test(password),
      whitespace: !/\s/.test(password)
    };

    let score = 0;

    if (checks.length) score += 30;
    if (checks.uppercase) score += 15;
    if (checks.lowercase) score += 15;
    if (checks.number) score += 15;
    if (checks.special) score += 20;
    if (checks.whitespace) score += 5;

    return {
      score,
      strength: this.getStrength(score),
      passed: Object.values(checks).every(Boolean),
      checks
    };
  }

  getStrength(score) {
    if (score >= 90) {
      return "VERY_STRONG";
    }

    if (score >= 75) {
      return "STRONG";
    }

    if (score >= 60) {
      return "GOOD";
    }

    if (score >= 40) {
      return "WEAK";
    }

    return "VERY_WEAK";
  }
}

module.exports = PasswordStrengthService;
