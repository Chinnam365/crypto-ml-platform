"use strict";

const Repository = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepository");
const Validator = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryValidator");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryBuilder {
  constructor(options = {}) {
    this.validator = options.validator || new Validator();
    this.repository = new Repository();
  }

  add(name, provider) {
    const validatedName = this.validator.validateName(name);
    this.repository.save(validatedName, provider);
    return this;
  }

  addMany(entries = []) {
    for (const entry of entries) {
      if (entry && typeof entry.name === "string") {
        this.add(entry.name, entry.provider);
      }
    }

    return this;
  }

  build() {
    return this.repository;
  }

  reset() {
    this.repository = new Repository();
    return this;
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryBuilder",
      healthy: true,
      repositorySize: this.repository.count(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryBuilder;
