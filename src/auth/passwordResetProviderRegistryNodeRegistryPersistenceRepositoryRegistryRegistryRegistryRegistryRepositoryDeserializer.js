"use strict";

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryDeserializer {
  deserialize(payload) {
    if (payload === null || payload === undefined) {
      throw new TypeError("Payload is required.");
    }

    const data =
      typeof payload === "string" ? JSON.parse(payload) : payload;

    return Array.isArray(data.entries) ? data.entries : [];
  }

  deserializeInto(repository, payload) {
    if (!repository || typeof repository.save !== "function") {
      throw new TypeError("Invalid repository.");
    }

    const entries = this.deserialize(payload);

    for (const entry of entries) {
      if (
        entry &&
        typeof entry.name === "string" &&
        entry.provider !== undefined
      ) {
        repository.save(entry.name, entry.provider);
      }
    }

    return repository;
  }

  deserializeBuffer(repository, buffer) {
    if (!Buffer.isBuffer(buffer)) {
      throw new TypeError("Expected a Buffer.");
    }

    return this.deserializeInto(repository, buffer.toString("utf8"));
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryDeserializer",
      healthy: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryDeserializer;
