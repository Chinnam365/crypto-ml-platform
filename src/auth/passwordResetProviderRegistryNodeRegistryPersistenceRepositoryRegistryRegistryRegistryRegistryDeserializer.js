"use strict";

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryDeserializer {
  deserialize(payload) {
    if (payload === null || payload === undefined) {
      throw new TypeError("Payload is required.");
    }

    const data =
      typeof payload === "string" ? JSON.parse(payload) : payload;

    const registry = new Map();

    if (!Array.isArray(data.registries)) {
      return registry;
    }

    for (const entry of data.registries) {
      if (
        entry &&
        typeof entry.name === "string" &&
        entry.name.trim().length > 0
      ) {
        registry.set(entry.name.trim(), entry.value);
      }
    }

    return registry;
  }

  deserializeFromBuffer(buffer) {
    if (!Buffer.isBuffer(buffer)) {
      throw new TypeError("Expected a Buffer.");
    }

    return this.deserialize(buffer.toString("utf8"));
  }

  deserializeFromFileContent(fileContent) {
    if (typeof fileContent !== "string") {
      throw new TypeError("File content must be a string.");
    }

    return this.deserialize(fileContent);
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryDeserializer",
      healthy: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryDeserializer;
