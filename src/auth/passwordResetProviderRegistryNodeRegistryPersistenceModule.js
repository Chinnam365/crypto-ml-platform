"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceService = require("./passwordResetProviderRegistryNodeRegistryPersistenceService");
const PasswordResetProviderRegistryNodeRegistryPersistenceController = require("./passwordResetProviderRegistryNodeRegistryPersistenceController");
const PasswordResetProviderRegistryNodeRegistryPersistenceRoutes = require("./passwordResetProviderRegistryNodeRegistryPersistenceRoutes");

class PasswordResetProviderRegistryNodeRegistryPersistenceModule {
  constructor(options = {}) {
    this.options = options;

    this.service =
      options.service ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceService(options);

    this.controller =
      options.controller ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceController({
        ...options,
        service: this.service
      });

    this.routes =
      options.routes ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRoutes({
        ...options,
        controller: this.controller
      });

    this.basePath =
      options.basePath ||
      "/auth/provider-registry/registry/persistence";

    this.initialized = false;
  }

  initialize() {
    this.initialized = true;
    return this.status();
  }

  register(app) {
    if (!app || typeof app.use !== "function") {
      throw new TypeError("A valid Express application instance is required.");
    }

    app.use(this.basePath, this.routes.getRouter());

    return this.status();
  }

  shutdown() {
    this.initialized = false;
    return this.status();
  }

  getService() {
    return this.service;
  }

  getController() {
    return this.controller;
  }

  getRouter() {
    return this.routes.getRouter();
  }

  getRoutes() {
    return this.routes;
  }

  status() {
    return {
      module: "PasswordResetProviderRegistryNodeRegistryPersistenceModule",
      initialized: this.initialized,
      basePath: this.basePath,
      service: this.service.status(),
      controller: this.controller.status(),
      routes: this.routes.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceModule;
