"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryModule = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryModule");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryApi {
  constructor(options = {}) {
    this.module =
      options.module ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryModule(
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
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryApi",
      module: this.module.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryApi;
