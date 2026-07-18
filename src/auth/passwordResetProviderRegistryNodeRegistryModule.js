"use strict";

const PasswordResetProviderRegistryNodeRegistryService = require("./passwordResetProviderRegistryNodeRegistryService");
const PasswordResetProviderRegistryNodeRegistryController = require("./passwordResetProviderRegistryNodeRegistryController");
const createPasswordResetProviderRegistryNodeRegistryRouter = require("./passwordResetProviderRegistryNodeRegistryRoutes");

class PasswordResetProviderRegistryNodeRegistryModule {
  constructor(options = {}) {
    this.service =
      options.service ||
      new PasswordResetProviderRegistryNodeRegistryService(options);

    this.controller =
      options.controller ||
      new PasswordResetProviderRegistryNodeRegistryController(
        this.service
      );

    this.router =
      options.router ||
      createPasswordResetProviderRegistryNodeRegistryRouter(
        this.controller
      );

    this.mountPath =
      options.mountPath ||
      "/auth/provider-registry/registry";

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

  getController() {
    return this.controller;
  }

  getRouter() {
    return this.router;
  }

  isInitialized() {
    return this.initialized;
  }

  status() {
    return {
      module:
        "PasswordResetProviderRegistryNodeRegistryModule",
      initialized: this.initialized,
      mountPath: this.mountPath,
      service: this.service.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryModule;
