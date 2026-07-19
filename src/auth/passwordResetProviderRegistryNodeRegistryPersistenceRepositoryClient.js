"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryFacade = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryFacade");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryClient {
  constructor(options = {}) {
    this.facade =
      options.facade ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryFacade(
        options
      );
  }

  save(id, record = {}) {
    return this.facade.save(id, record);
  }

  update(id, updates = {}) {
    return this.facade.update(id, updates);
  }

  findById(id) {
    return this.facade.findById(id);
  }

  findAll() {
    return this.facade.findAll();
  }

  exists(id) {
    return this.facade.exists(id);
  }

  delete(id) {
    return this.facade.delete(id);
  }

  deleteAll() {
    return this.facade.deleteAll();
  }

  export() {
    return this.facade.export();
  }

  import(serializedData) {
    return this.facade.import(serializedData);
  }

  getRouter() {
    return this.facade.getRouter();
  }

  status() {
    return {
      client:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryClient",
      facade: this.facade.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryClient;
