"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryClient = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryClient");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositorySdk {
  constructor(options = {}) {
    this.client =
      options.client ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryClient(
        options
      );
  }

  save(id, record = {}) {
    return this.client.save(id, record);
  }

  update(id, updates = {}) {
    return this.client.update(id, updates);
  }

  findById(id) {
    return this.client.findById(id);
  }

  findAll() {
    return this.client.findAll();
  }

  exists(id) {
    return this.client.exists(id);
  }

  delete(id) {
    return this.client.delete(id);
  }

  deleteAll() {
    return this.client.deleteAll();
  }

  export() {
    return this.client.export();
  }

  import(serializedData) {
    return this.client.import(serializedData);
  }

  getRouter() {
    return this.client.getRouter();
  }

  status() {
    return {
      sdk:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositorySdk",
      client: this.client.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositorySdk;
