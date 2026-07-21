"use strict";

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistrySerializer {
  serialize(repositoryRegistry = {}) {
    return JSON.stringify(repositoryRegistry);
  }

  deserialize(serialized) {
    if (serialized === null || serialized === undefined) {
      return null;
    }

    if (typeof serialized === "object") {
      return serialized;
    }

    return JSON.parse(serialized);
  }

  serializeCollection(registries = []) {
    if (!Array.isArray(registries)) {
      throw new TypeError("registries must be an array.");
    }

    return JSON.stringify(registries);
  }

  deserializeCollection(serialized) {
    if (serialized === null || serialized === undefined) {
      return [];
    }

    const registries =
      typeof serialized === "string"
        ? JSON.parse(serialized)
        : serialized;

    if (!Array.isArray(registries)) {
      throw new TypeError("Serialized data must contain an array.");
    }

    return registries;
  }

  clone(repositoryRegistry = {}) {
    return this.deserialize(this.serialize(repositoryRegistry));
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistrySerializer",
      format: "json",
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistrySerializer;
