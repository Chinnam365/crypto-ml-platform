"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryModule = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryModule");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryApi {
  constructor(options = {}) {
    this.module =
      options.module ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryModule(
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
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryApi",
      module: this.module.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryApi;
