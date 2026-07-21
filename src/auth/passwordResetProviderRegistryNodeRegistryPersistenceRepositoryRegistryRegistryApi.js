"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryModule = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryModule");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryApi {
  constructor(options = {}) {
    this.module =
      options.module ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryModule(
        options
      );
  }

  getRouter() {
    return this.module.getRouter();
  }

  getController() {
    return this.module.getController();
  }

  getService() {
    return this.module.getService();
  }

  getManager() {
    return this.module.getManager();
  }

  getFactory() {
    return this.module.getFactory();
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryApi",
      module: this.module.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryApi;
