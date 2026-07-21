"use strict";

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryDeserializer {
  deserialize(payload) {
    if (payload === null || payload === undefined) {
      throw new TypeError("Payload is required.");
    }

    const data =
      typeof payload === "string" ? JSON.parse(payload) : payload;

    return Array.isArray(data.registries) ? data.registries : [];
  }

  deserializeInto(repositoryRegistry, payload) {
    if (
      !repositoryRegistry ||
      typeof repositoryRegistry.register !== "function"
    ) {
      throw new TypeError("Invalid repository registry.");
    }

    const registries = this.deserialize(payload);

    for (const entry of registries) {
      if (
        entry &&
        typeof entry.name === "string" &&
        entry.repository !== undefined
      ) {
        repositoryRegistry.register(entry.name, entry.repository);
      }
    }

    return repositoryRegistry;
  }

  deserializeBuffer(repositoryRegistry, buffer) {
    if (!Buffer.isBuffer(buffer)) {
      throw new TypeError("Expected a Buffer.");
    }

    return this.deserializeInto(
      repositoryRegistry,
      buffer.toString("utf8")
    );
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryDeserializer",
      healthy: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryDeserializer;
