"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryModule = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryModule");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryApi {
  constructor(options = {}) {
    this.module =
      options.module ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryModule(
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
      api: "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryApi",
      module: this.module.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryApi;
