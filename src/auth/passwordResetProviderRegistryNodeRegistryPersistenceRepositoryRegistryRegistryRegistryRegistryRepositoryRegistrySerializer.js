"use strict";

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistrySerializer {
  serialize(repositoryRegistry) {
    if (
      !repositoryRegistry ||
      typeof repositoryRegistry.list !== "function" ||
      typeof repositoryRegistry.get !== "function"
    ) {
      throw new TypeError("Invalid repository registry.");
    }

    const registries = repositoryRegistry.list().map(name => ({
      name,
      repository: repositoryRegistry.get(name)
    }));

    return JSON.stringify(
      {
        version: "1.0.0",
        exportedAt: new Date().toISOString(),
        registries
      },
      null,
      2
    );
  }

  deserialize(payload) {
    return typeof payload === "string"
      ? JSON.parse(payload)
      : payload;
  }

  clone(repositoryRegistry) {
    return this.deserialize(this.serialize(repositoryRegistry));
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistrySerializer",
      healthy: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistrySerializer;
