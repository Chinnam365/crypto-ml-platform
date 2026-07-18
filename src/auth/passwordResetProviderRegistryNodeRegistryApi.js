"use strict";

const PasswordResetProviderRegistryNodeRegistryModule = require("./passwordResetProviderRegistryNodeRegistryModule");

class PasswordResetProviderRegistryNodeRegistryApi {
  constructor(options = {}) {
    this.module =
      options.module ||
      new PasswordResetProviderRegistryNodeRegistryModule(options);

    this.app = null;
    this.registered = false;
  }

  initialize(app) {
    if (!app || typeof app.use !== "function") {
      throw new TypeError(
        "A valid Express application instance is required."
      );
    }

    this.app = app;

    this.module.initialize();
    this.module.register(app);

    this.registered = true;

    return this.status();
  }

  shutdown() {
    this.module.shutdown();

    this.registered = false;

    return this.status();
  }

  getModule() {
    return this.module;
  }

  getService() {
    return this.module.getService();
  }

  getController() {
    return this.module.getController();
  }

  getRouter() {
    return this.module.getRouter();
  }

  isRegistered() {
    return this.registered;
  }

  status() {
    return {
      api:
        "PasswordResetProviderRegistryNodeRegistryApi",
      registered: this.registered,
      module: this.module.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryApi;
