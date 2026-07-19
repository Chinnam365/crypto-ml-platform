"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryBootstrap = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryBootstrap");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryFacade {
  constructor(options = {}) {
    this.bootstrap =
      options.bootstrap ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryBootstrap(
        options
      );

    this.bootstrap.initialize();
  }

  getRouter() {
    return this.bootstrap.getRouter();
  }

  save(id, record = {}) {
    return this.bootstrap
      .getApi()
      .getService()
      .save(id, record);
  }

  update(id, updates = {}) {
    return this.bootstrap
      .getApi()
      .getService()
      .update(id, updates);
  }

  findById(id) {
    return this.bootstrap
      .getApi()
      .getService()
      .findById(id);
  }

  findAll() {
    return this.bootstrap
      .getApi()
      .getService()
      .findAll();
  }

  exists(id) {
    return this.bootstrap
      .getApi()
      .getService()
      .exists(id);
  }

  delete(id) {
    return this.bootstrap
      .getApi()
      .getService()
      .delete(id);
  }

  deleteAll() {
    return this.bootstrap
      .getApi()
      .getService()
      .deleteAll();
  }

  export() {
    return this.bootstrap
      .getApi()
      .getService()
      .export();
  }

  import(serializedData) {
    return this.bootstrap
      .getApi()
      .getService()
      .import(serializedData);
  }

  status() {
    return {
      facade:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryFacade",
      bootstrap: this.bootstrap.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryFacade;
