"use strict";

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistrySerializer {
  serialize(registry) {
    if (!(registry instanceof Map)) {
      throw new TypeError("Registry must be a Map.");
    }

    return JSON.stringify(
      {
        version: "1.0.0",
        exportedAt: new Date().toISOString(),
        providers: Array.from(registry.entries()).map(([name, provider]) => ({
          name,
          provider
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

    if (Array.isArray(data.providers)) {
      for (const entry of data.providers) {
        registry.set(entry.name, entry.provider);
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
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistrySerializer",
      healthy: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistrySerializer;
