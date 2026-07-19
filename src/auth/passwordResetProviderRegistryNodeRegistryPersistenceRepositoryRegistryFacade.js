"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryBootstrap = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryBootstrap");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryFacade {
  constructor(options = {}) {
    this.bootstrap =
      options.bootstrap ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryBootstrap(
        options
      );

    this.bootstrap.initialize();
  }

  getRouter() {
    return this.bootstrap.getRouter();
  }

  register(name, repository) {
    return this.bootstrap
      .getApi()
      .getService()
      .register(name, repository);
  }

  unregister(name) {
    return this.bootstrap
      .getApi()
      .getService()
      .unregister(name);
  }

  get(name = "default") {
    return this.bootstrap
      .getApi()
      .getService()
      .get(name);
  }

  has(name) {
    return this.bootstrap
      .getApi()
      .getService()
      .has(name);
  }

  list() {
    return this.bootstrap
      .getApi()
      .getService()
      .list();
  }

  clear() {
    return this.bootstrap
      .getApi()
      .getService()
      .clear();
  }

  count() {
    return this.bootstrap
      .getApi()
      .getService()
      .count();
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryFacade",
      bootstrap: this.bootstrap.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryFacade;
