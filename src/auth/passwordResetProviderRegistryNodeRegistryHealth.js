"use strict";

const PasswordResetProviderRegistryNodeRegistryManager = require("./passwordResetProviderRegistryNodeRegistryManager");

class PasswordResetProviderRegistryNodeRegistryHealth {
  constructor(options = {}) {
    this.manager =
      options.manager ||
      new PasswordResetProviderRegistryNodeRegistryManager(options);
  }

  check() {
    const status = this.manager.status();

    const nodeCount = this.manager.nodeCount();

    return {
      healthy: status.started,
      started: status.started,
      nodeCount,
      registryHealthy: nodeCount >= 0,
      checkedAt: new Date().toISOString()
    };
  }

  detailed() {
    return {
      ...this.check(),
      nodes: this.manager.listNodes(),
      manager: this.manager.status()
    };
  }

  status() {
    return {
      service:
        "PasswordResetProviderRegistryNodeRegistryHealth",
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryHealth;
