"use strict";

const PasswordResetProviderRegistryNodeRegistryManager = require("./passwordResetProviderRegistryNodeRegistryManager");

class PasswordResetProviderRegistryNodeRegistryDiagnostics {
  constructor(options = {}) {
    this.manager =
      options.manager ||
      new PasswordResetProviderRegistryNodeRegistryManager(options);
  }

  inspect() {
    const status = this.manager.status();

    return {
      diagnostics: {
        started: status.started,
        nodeCount: this.manager.nodeCount(),
        nodes: this.manager.listNodes(),
        registry: status.registry
      },
      inspectedAt: new Date().toISOString()
    };
  }

  inspectNode(id) {
    const node = this.manager.getNode(id);

    if (!node) {
      return {
        success: false,
        message: "Node not found.",
        inspectedAt: new Date().toISOString()
      };
    }

    return {
      success: true,
      node,
      inspectedAt: new Date().toISOString()
    };
  }

  status() {
    return {
      diagnostics:
        "PasswordResetProviderRegistryNodeRegistryDiagnostics",
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryDiagnostics;
