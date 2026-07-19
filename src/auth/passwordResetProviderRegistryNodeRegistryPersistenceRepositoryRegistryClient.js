"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryFacade = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryFacade");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryClient {
  constructor(options = {}) {
    this.facade =
      options.facade ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryFacade(
        options
      );
  }

  register(name, repository) {
    return this.facade.register(name, repository);
  }

  unregister(name) {
    return this.facade.unregister(name);
  }

  get(name = "default") {
    return this.facade.get(name);
  }

  has(name) {
    return this.facade.has(name);
  }

  list() {
    return this.facade.list();
  }

  clear() {
    return this.facade.clear();
  }

  count() {
    return this.facade.count();
  }

  getRouter() {
    return this.facade.getRouter();
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryClient",
      facade: this.facade.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryClient;
