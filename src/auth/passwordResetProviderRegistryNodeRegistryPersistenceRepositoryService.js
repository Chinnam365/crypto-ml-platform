"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryManager = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryManager");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryService {
  constructor(options = {}) {
    this.manager =
      options.manager ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryManager(
        options
      );
  }

  getManager() {
    return this.manager;
  }

  getRepository() {
    return this.manager.getRepository();
  }

  getFactory() {
    return this.manager.getFactory();
  }

  save(id, record = {}) {
    return this.manager.save(id, record);
  }

  update(id, updates = {}) {
    return this.manager.update(id, updates);
  }

  findById(id) {
    return this.manager.findById(id);
  }

  findAll() {
    return this.manager.findAll();
  }

  exists(id) {
    return this.manager.exists(id);
  }

  delete(id) {
    return this.manager.delete(id);
  }

  deleteAll() {
    return this.manager.deleteAll();
  }

  count() {
    return this.manager.count();
  }

  export() {
    return this.manager.export();
  }

  import(serializedData) {
    return this.manager.import(serializedData);
  }

  status() {
    return {
      service:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryService",
      manager: this.manager.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryService;
