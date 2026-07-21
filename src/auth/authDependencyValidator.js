"use strict";

const logger = require("../config/logger");

class AuthDependencyValidator {
  constructor(dependencies = {}) {
    this.dependencies = dependencies;
  }

  validate() {
    const failures = [];

    for (const [name, dependency] of Object.entries(this.dependencies)) {
      if (dependency === undefined || dependency === null) {
        failures.push(name);
      }
    }

    if (failures.length > 0) {
      logger.error(
        {
          missing: failures
        },
        "Authentication dependency validation failed."
      );

      throw new Error(
        `Missing authentication dependencies: ${failures.join(", ")}`
      );
    }

    logger.info(
      {
        validated: Object.keys(this.dependencies).length
      },
      "Authentication dependencies validated."
    );

    return true;
  }
}

module.exports = AuthDependencyValidator;
