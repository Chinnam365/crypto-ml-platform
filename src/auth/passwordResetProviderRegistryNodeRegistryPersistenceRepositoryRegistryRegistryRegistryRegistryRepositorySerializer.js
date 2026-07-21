"use strict";

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositorySerializer {
  serialize(repository) {
    if (!repository || typeof repository.findAll !== "function") {
      throw new TypeError("Invalid repository.");
    }

    return JSON.stringify(
      {
        version: "1.0.0",
        exportedAt: new Date().toISOString(),
        entries: repository.findAll()
      },
      null,
      2
    );
  }

  deserialize(payload, repository) {
    if (!repository || typeof repository.save !== "function") {
      throw new TypeError("Invalid repository.");
    }

    const data =
      typeof payload === "string" ? JSON.parse(payload) : payload;

    if (Array.isArray(data.entries)) {
      for (const entry of data.entries) {
        repository.save(entry.name, entry.provider);
      }
    }

    return repository;
  }

  clone(repository) {
    const serialized = this.serialize(repository);

    return JSON.parse(serialized);
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositorySerializer",
      healthy: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositorySerializer;
