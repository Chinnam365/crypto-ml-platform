"use strict";

const createPasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRoutes = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRoutes");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryController = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryController");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryService = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryService");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryManager = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryManager");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryFactory = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryFactory");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryModule {
  constructor(options = {}) {
    this.factory =
      options.factory ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryFactory(
        options
      );

    this.manager =
      options.manager ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryManager({
        ...options,
        factory: this.factory
      });

    this.service =
      options.service ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryService({
        ...options,
        manager: this.manager
      });

    this.controller =
      options.controller ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryController({
        ...options,
        service: this.service
      });

    this.router =
      options.router ||
      createPasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRoutes({
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
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryModule",
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryModule;
