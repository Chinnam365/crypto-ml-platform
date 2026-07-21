"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistrySerializer = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistrySerializer");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryDeserializer = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryDeserializer");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistrySnapshot {
  constructor(options = {}) {
    this.serializer =
      options.serializer ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistrySerializer();

    this.deserializer =
      options.deserializer ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryDeserializer();
  }

  create(registry) {
    if (!(registry instanceof Map)) {
      throw new TypeError("Registry must be a Map.");
    }

    return {
      id: this.#generateId(),
      createdAt: new Date().toISOString(),
      payload: this.serializer.serialize(registry)
    };
  }

  restore(snapshot) {
    if (!snapshot || typeof snapshot.payload !== "string") {
      throw new TypeError("Invalid snapshot.");
    }

    return this.deserializer.deserialize(snapshot.payload);
  }

  clone(snapshot) {
    if (!snapshot || typeof snapshot !== "object") {
      throw new TypeError("Invalid snapshot.");
    }

    return {
      id: this.#generateId(),
      createdAt: new Date().toISOString(),
      payload: snapshot.payload
    };
  }

  #generateId() {
    return [
      Date.now().toString(36),
      Math.random().toString(36).slice(2, 10)
    ].join("-");
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistrySnapshot",
      healthy: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistrySnapshot;
