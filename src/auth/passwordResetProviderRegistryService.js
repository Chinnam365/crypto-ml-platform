"use strict";

const PasswordResetProviderRegistryModule = require("./passwordResetProviderRegistryModule");

class PasswordResetProviderRegistryService {
  constructor(options = {}) {
    this.module =
      options.module ||
      new PasswordResetProviderRegistryModule(options);
  }

  async initialize() {
    return this.module.initialize();
  }

  async shutdown() {
    return this.module.shutdown();
  }

  async restart() {
    return this.module.restart();
  }

  register(type, implementation) {
    return this.module
      .getManager()
      .register(type, implementation);
  }

  unregister(type) {
    return this.module
      .getManager()
      .unregister(type);
  }

  get(type) {
    return this.module
      .getManager()
      .get(type);
  }

  list() {
    return this.module
      .getManager()
      .list();
  }

  async health() {
    return this.module.health();
  }

  async diagnostics() {
    return this.module.diagnostics();
  }

  async report() {
    return this.module.report();
  }

  status() {
    return this.module.status();
  }
}

module.exports =
  PasswordResetProviderRegistryService;
