"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryFactory = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryFactory");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryManager {
  constructor(options = {}) {
    this.factory =
      options.factory ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryFactory(
        options
      );

    this.repository =
      options.repository ||
      this.factory.create(options);

    this.createdAt = new Date().toISOString();
  }

  getRepository() {
    return this.repository;
  }

  getFactory() {
    return this.factory;
  }

  save(id, record = {}) {
    return this.repository.save(id, record);
  }

  update(id, updates = {}) {
    return this.repository.update(id, updates);
  }

  findById(id) {
    return this.repository.findById(id);
  }

  findAll() {
    return this.repository.findAll();
  }

  exists(id) {
    return this.repository.exists(id);
  }

  delete(id) {
    return this.repository.delete(id);
  }

  deleteAll() {
    return this.repository.deleteAll();
  }

  count() {
    return this.repository.count();
  }

  export() {
    return this.repository.export();
  }

  import(serializedData) {
    return this.repository.import(serializedData);
  }

  status() {
    return {
      manager:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryManager",
      repository: this.repository.status(),
      factory: this.factory.status(),
      createdAt: this.createdAt,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryManager;
