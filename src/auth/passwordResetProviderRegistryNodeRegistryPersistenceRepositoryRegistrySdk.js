"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryClient = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryClient");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistrySdk {
  constructor(options = {}) {
    this.client =
      options.client ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryClient(
        options
      );
  }

  register(name, repository) {
    return this.client.register(name, repository);
  }

  unregister(name) {
    return this.client.unregister(name);
  }

  get(name = "default") {
    return this.client.get(name);
  }

  has(name) {
    return this.client.has(name);
  }

  list() {
    return this.client.list();
  }

  clear() {
    return this.client.clear();
  }

  count() {
    return this.client.count();
  }

  getRouter() {
    return this.client.getRouter();
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistrySdk",
      client: this.client.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistrySdk;
