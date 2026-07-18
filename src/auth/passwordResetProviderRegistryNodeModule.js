"use strict";

const PasswordResetProviderRegistryNodeService = require("./passwordResetProviderRegistryNodeService");
const createPasswordResetProviderRegistryNodeRouter = require("./passwordResetProviderRegistryNodeRoutes");

class PasswordResetProviderRegistryNodeModule {
  constructor(options = {}) {
    this.service =
      options.service ||
      new PasswordResetProviderRegistryNodeService(options);

    this.router =
      options.router ||
      createPasswordResetProviderRegistryNodeRouter(
        options.controller
      );

    this.mountPath =
      options.mountPath ||
      "/auth/provider-registry/nodes";

    this.initialized = false;
  }

  initialize() {
    this.initialized = true;
    return this.status();
  }

  shutdown() {
    this.initialized = false;
    return this.status();
  }

  register(app) {
    if (!app || typeof app.use !== "function") {
      throw new TypeError(
        "A valid Express application instance is required."
      );
    }

    app.use(this.mountPath, this.router);

    return this;
  }

  getService() {
    return this.service;
  }

  getRouter() {
    return this.router;
  }

  isInitialized() {
    return this.initialized;
  }

  status() {
    return {
      module: "PasswordResetProviderRegistryNodeModule",
      initialized: this.initialized,
      mountPath: this.mountPath,
      service: this.service.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeModule;
