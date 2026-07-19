"use strict";

const createPasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRoutes = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRoutes");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryController = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryController");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryService = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryService");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryManager = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryManager");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryFactory = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryFactory");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryModule {
  constructor(options = {}) {
    this.factory =
      options.factory ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryFactory(
        options
      );

    this.manager =
      options.manager ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryManager({
        ...options,
        factory: this.factory
      });

    this.service =
      options.service ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryService({
        ...options,
        manager: this.manager
      });

    this.controller =
      options.controller ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryController({
        ...options,
        service: this.service
      });

    this.router =
      options.router ||
      createPasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRoutes({
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
      module:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryModule",
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryModule;
