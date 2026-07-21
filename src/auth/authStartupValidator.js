"use strict";

class AuthStartupValidator {
  constructor(options = {}) {
    this.dependencies = options.dependencies || {};
    this.required = options.required || [];
  }

  async validate() {
    const report = {
      valid: true,
      checkedAt: new Date().toISOString(),
      dependencies: {}
    };

    for (const dependencyName of this.required) {
      const dependency = this.dependencies[dependencyName];

      if (!dependency) {
        report.valid = false;
        report.dependencies[dependencyName] = {
          available: false,
          reason: "Dependency not registered."
        };
        continue;
      }

      try {
        if (typeof dependency.status === "function") {
          const status = await dependency.status();

          report.dependencies[dependencyName] = {
            available: true,
            healthy: status.healthy !== false
          };

          if (status.healthy === false) {
            report.valid = false;
          }
        } else {
          report.dependencies[dependencyName] = {
            available: true,
            healthy: true
          };
        }
      } catch (error) {
        report.valid = false;

        report.dependencies[dependencyName] = {
          available: true,
          healthy: false,
          error: error.message
        };
      }
    }

    return report;
  }

  async isValid() {
    const report = await this.validate();
    return report.valid;
  }
}

module.exports = AuthStartupValidator;
