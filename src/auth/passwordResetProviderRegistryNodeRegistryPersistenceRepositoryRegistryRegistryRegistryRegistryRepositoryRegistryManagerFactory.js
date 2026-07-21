"use strict";

const RepositoryRegistry = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistry");
const RepositoryRegistryManager = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryManager");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryManagerFactory {
  create(options = {}) {
    return new RepositoryRegistryManager({
      registry: options.registry || new RepositoryRegistry()
    });
  }

  createEmpty() {
    return new RepositoryRegistryManager({
      registry: new RepositoryRegistry()
    });
  }

  createWithRegistry(registry) {
    return new RepositoryRegistryManager({
      registry
    });
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryManagerFactory",
      healthy: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryManagerFactory;
