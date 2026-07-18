"use strict";

const PasswordResetProviderRegistry = require("./passwordResetProviderRegistry");
const PasswordResetProviderFactory = require("./passwordResetProviderFactory");
const PasswordResetProviderRegistryHealth = require("./passwordResetProviderRegistryHealth");
const PasswordResetProviderRegistryDiagnostics = require("./passwordResetProviderRegistryDiagnostics");
const PasswordResetProviderRegistryReporter = require("./passwordResetProviderRegistryReporter");
const PasswordResetProviderRegistryLifecycle = require("./passwordResetProviderRegistryLifecycle");

class PasswordResetProviderRegistryManager {
  constructor(options = {}) {
    this.registry =
      options.registry ||
      new PasswordResetProviderRegistry();

    this.factory =
      options.factory ||
      new PasswordResetProviderFactory();

    this.health =
      options.health ||
      new PasswordResetProviderRegistryHealth(
        this.registry
      );

    this.diagnostics =
      options.diagnostics ||
      new PasswordResetProviderRegistryDiagnostics(
        this.registry
      );

    this.reporter =
      options.reporter ||
      new PasswordResetProviderRegistryReporter(
        this.registry
      );

    this.lifecycle =
      options.lifecycle ||
      new PasswordResetProviderRegistryLifecycle(
        this.registry
      );
  }

  register(type, implementation = null) {
    const provider = this.factory.create(
      type,
      implementation
    );

    this.registry.register(type, provider);

    return provider;
  }

  unregister(type) {
    return this.registry.unregister(type);
  }

  get(type) {
    return this.registry.get(type);
  }

  list() {
    return this.registry.list();
  }

  async start() {
    return this.lifecycle.start();
  }

  async stop() {
    return this.lifecycle.stop();
  }

  async healthCheck() {
    return this.health.check();
  }

  async diagnosticsReport() {
    return this.diagnostics.run();
  }

  async report() {
    return this.reporter.generateReport();
  }
}

module.exports =
  PasswordResetProviderRegistryManager;
