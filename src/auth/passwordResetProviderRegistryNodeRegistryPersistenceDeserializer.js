"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceSerializer = require("./passwordResetProviderRegistryNodeRegistryPersistenceSerializer");

class PasswordResetProviderRegistryNodeRegistryPersistenceDeserializer {
  constructor(options = {}) {
    this.serializer =
      options.serializer ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceSerializer();
  }

  deserialize(payload) {
    return this.serializer.deserialize(payload);
  }

  deserializeCollection(payload) {
    return this.serializer.deserializeCollection(payload);
  }

  deserializeSafe(payload, fallback = null) {
    try {
      return this.deserialize(payload);
    } catch (error) {
      return fallback;
    }
  }

  deserializeCollectionSafe(payload, fallback = []) {
    try {
      return this.deserializeCollection(payload);
    } catch (error) {
      return fallback;
    }
  }

  isSerialized(payload) {
    if (typeof payload !== "string") {
      return false;
    }

    try {
      JSON.parse(payload);
      return true;
    } catch (_) {
      return false;
    }
  }

  status() {
    return {
      deserializer:
        "PasswordResetProviderRegistryNodeRegistryPersistenceDeserializer",
      serializer: this.serializer.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceDeserializer;
