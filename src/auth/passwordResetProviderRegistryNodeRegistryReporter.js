"use strict";

const PasswordResetProviderRegistryNodeRegistryHealth = require("./passwordResetProviderRegistryNodeRegistryHealth");
const PasswordResetProviderRegistryNodeRegistryDiagnostics = require("./passwordResetProviderRegistryNodeRegistryDiagnostics");

class PasswordResetProviderRegistryNodeRegistryReporter {
  constructor(options = {}) {
    this.health =
      options.health ||
      new PasswordResetProviderRegistryNodeRegistryHealth(options);

    this.diagnostics =
      options.diagnostics ||
      new PasswordResetProviderRegistryNodeRegistryDiagnostics(options);
  }

  generate() {
    return {
      generatedAt: new Date().toISOString(),
      health: this.health.detailed(),
      diagnostics: this.diagnostics.inspect()
    };
  }

  export() {
    return JSON.stringify(this.generate(), null, 2);
  }

  status() {
    return {
      reporter:
        "PasswordResetProviderRegistryNodeRegistryReporter",
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryReporter;
