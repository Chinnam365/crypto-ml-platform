"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryCache = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryCache");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryValidator = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryValidator");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryStore {
  constructor(options = {}) {
    this.cache =
      options.cache ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryCache(
        options
      );

    this.validator =
      options.validator ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryValidator(
        options
      );
  }

  save(id, record = {}) {
    this.validator.validate(id, record);

    const entity = {
      id,
      ...record,
      updatedAt: new Date().toISOString()
    };

    this.cache.set(id, entity);

    return entity;
  }

  update(id, updates = {}) {
    const current = this.findById(id) || { id };

    return this.save(id, {
      ...current,
      ...updates
    });
  }

  findById(id) {
    return this.cache.get(id) || null;
  }

  findAll() {
    return this.cache.values();
  }

  exists(id) {
    return this.cache.has(id);
  }

  delete(id) {
    const existing = this.findById(id);

    if (!existing) {
      return false;
    }

    this.cache.delete(id);
    return true;
  }

  clear() {
    this.cache.clear();
    return true;
  }

  count() {
    return this.cache.size();
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryStore",
      records: this.count(),
      cache: this.cache.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryStore;
