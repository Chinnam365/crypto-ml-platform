"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistrySerializer = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistrySerializer");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryDeserializer = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryDeserializer");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistrySnapshot {
  constructor(options = {}) {
    this.serializer =
      options.serializer ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistrySerializer();

    this.deserializer =
      options.deserializer ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryDeserializer();
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
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistrySnapshot",
      healthy: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistrySnapshot;
