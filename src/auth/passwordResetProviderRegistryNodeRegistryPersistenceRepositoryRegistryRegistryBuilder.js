"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryOptions = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryOptions");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryFactory = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryFactory");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryManager = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryManager");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryService = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryService");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryController = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryController");
const createRoutes = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRoutes");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryBuilder {
  constructor(options = {}) {
    this.options =
      options instanceof PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryOptions
        ? options
        : new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryOptions(
            options
          );
  }

  build() {
    const config = this.options.toJSON();

    const factory =
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryFactory(
        config
      );

    const manager =
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryManager({
        ...config,
        factory
      });

    const service =
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryService({
        ...config,
        manager
      });

    const controller =
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryController({
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
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryBuilder",
      configured: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryBuilder;
