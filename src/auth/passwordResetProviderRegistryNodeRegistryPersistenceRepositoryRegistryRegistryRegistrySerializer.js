"use strict";

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistrySerializer {
  serialize(registry) {
    if (!(registry instanceof Map)) {
      throw new TypeError("Registry must be a Map.");
    }

    return JSON.stringify(
      {
        version: "1.0.0",
        exportedAt: new Date().toISOString(),
        registries: Array.from(registry.entries()).map(([name, value]) => ({
          name,
          value
        }))
      },
      null,
      2
    );
  }

  deserialize(payload) {
    const data =
      typeof payload === "string" ? JSON.parse(payload) : payload;

    const registry = new Map();

    if (Array.isArray(data.registries)) {
      for (const entry of data.registries) {
        registry.set(entry.name, entry.value);
      }
    }

    return registry;
  }

  clone(registry) {
    return this.deserialize(this.serialize(registry));
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistrySerializer",
      healthy: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistrySerializer;
