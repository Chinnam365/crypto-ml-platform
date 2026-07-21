"use strict";

const RepositoryRegistryRepository = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryRepository");
const Repository = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepository");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryRepositoryManager {
  constructor(options = {}) {
    this.repository =
      options.repository || new RepositoryRegistryRepository();
  }

  register(name, repository = new Repository()) {
    return this.repository.save(name, repository);
  }

  resolve(name) {
    return this.repository.get(name);
  }

  exists(name) {
    return this.repository.has(name);
  }

  unregister(name) {
    return this.repository.delete(name);
  }

  list() {
    return this.repository.list();
  }

  clear() {
    this.repository.clear();
  }

  count() {
    return this.repository.count();
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryRepositoryManager",
      healthy: true,
      repositoryCount: this.count(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryRepositoryManager;
