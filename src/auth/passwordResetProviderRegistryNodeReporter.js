"use strict";

const PasswordResetProviderRegistryNodeDiagnostics = require("./passwordResetProviderRegistryNodeDiagnostics");
const PasswordResetProviderRegistryNodeMetrics = require("./passwordResetProviderRegistryNodeMetrics");

class PasswordResetProviderRegistryNodeReporter {
  constructor(options = {}) {
    this.diagnostics =
      options.diagnostics ||
      new PasswordResetProviderRegistryNodeDiagnostics(options);

    this.metrics =
      options.metrics ||
      new PasswordResetProviderRegistryNodeMetrics(options);
  }

  generate() {
    return {
      generatedAt: new Date().toISOString(),
      metrics: this.metrics.collect(),
      diagnostics: this.diagnostics.summary()
    };
  }

  export() {
    return JSON.stringify(this.generate(), null, 2);
  }

  status() {
    return {
      reporter: "PasswordResetProviderRegistryNodeReporter",
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeReporter;
