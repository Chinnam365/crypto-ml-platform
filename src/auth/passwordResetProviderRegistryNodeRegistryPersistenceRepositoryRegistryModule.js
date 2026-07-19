"use strict";

const createPasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRoutes = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRoutes");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryController = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryController");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryService = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryService");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryManager = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryManager");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryFactory = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryFactory");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryModule {
  constructor(options = {}) {
    this.factory =
      options.factory ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryFactory(
        options
      );

    this.manager =
      options.manager ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryManager({
        ...options,
        factory: this.factory
      });

    this.service =
      options.service ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryService({
        ...options,
        manager: this.manager
      });

    this.controller =
      options.controller ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryController({
        ...options,
        service: this.service
      });

    this.router =
      options.router ||
      createPasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRoutes({
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
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryModule",
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryModule;
