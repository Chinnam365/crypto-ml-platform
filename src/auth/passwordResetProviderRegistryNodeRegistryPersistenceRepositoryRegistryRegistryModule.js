"use strict";

const createPasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRoutes = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRoutes");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryController = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryController");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryService = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryService");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryManager = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryManager");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryFactory = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryFactory");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryModule {
  constructor(options = {}) {
    this.factory =
      options.factory ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryFactory(
        options
      );

    this.manager =
      options.manager ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryManager({
        ...options,
        factory: this.factory
      });

    this.service =
      options.service ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryService({
        ...options,
        manager: this.manager
      });

    this.controller =
      options.controller ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryController({
        ...options,
        service: this.service
      });

    this.router =
      options.router ||
      createPasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRoutes({
        ...options,
        controller: this.controller
      });
  }

  getFactory() {
    return this.factory;
  }

  getManager() {
    return this.manager;
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

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryModule",
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryModule;
