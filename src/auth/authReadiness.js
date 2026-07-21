"use strict";

class AuthReadiness {
  constructor(options = {}) {
    this.dependencies = options.dependencies || {};
  }

  async check() {
    const result = {
      ready: true,
      timestamp: new Date().toISOString(),
      dependencies: {}
    };

    for (const [name, dependency] of Object.entries(this.dependencies)) {
      try {
        if (dependency && typeof dependency.ready === "function") {
          result.dependencies[name] = await dependency.ready();
        } else if (
          dependency &&
          typeof dependency.isReady === "function"
        ) {
          result.dependencies[name] = {
            ready: await dependency.isReady()
          };
        } else {
          result.dependencies[name] = {
            ready: true
          };
        }

        if (result.dependencies[name].ready === false) {
          result.ready = false;
        }
      } catch (error) {
        result.ready = false;
        result.dependencies[name] = {
          ready: false,
          error: error.message
        };
      }
    }

    return result;
  }

  async isReady() {
    const status = await this.check();
    return status.ready;
  }

  status() {
    return this.check();
  }
}

module.exports = AuthReadiness;
