"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryOptions = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryOptions");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryFactory = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryFactory");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryManager = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryManager");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryService = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryService");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryController = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryController");
const createRoutes = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRoutes");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryBuilder {
  constructor(options = {}) {
    this.options =
      options instanceof PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryOptions
        ? options
        : new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryOptions(
            options
          );
  }

  build() {
    const config = this.options.toJSON();

    const factory =
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryFactory(
        config
      );

    const manager =
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryManager({
        ...config,
        factory
      });

    const service =
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryService({
        ...config,
        manager
      });

    const controller =
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryController({
        ...config,
        service
      });

    const router = createRoutes({
      ...config,
      controller
    });

    return {
      options: this.options,
      factory,
      manager,
      service,
      controller,
      router
    };
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryBuilder",
      configured: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryBuilder;
