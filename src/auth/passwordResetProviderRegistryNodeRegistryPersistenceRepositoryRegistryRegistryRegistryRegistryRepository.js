"use strict";

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepository {
  constructor() {
    this.store = new Map();
  }

  save(name, provider) {
    this.store.set(name, provider);

    return {
      success: true,
      name,
      savedAt: new Date().toISOString()
    };
  }

  find(name) {
    return this.store.get(name) || null;
  }

  findAll() {
    return Array.from(this.store.entries()).map(([name, provider]) => ({
      name,
      provider
    }));
  }

  exists(name) {
    return this.store.has(name);
  }

  delete(name) {
    return this.store.delete(name);
  }

  clear() {
    this.store.clear();
  }

  count() {
    return this.store.size;
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepository",
      healthy: true,
      count: this.count(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepository;
