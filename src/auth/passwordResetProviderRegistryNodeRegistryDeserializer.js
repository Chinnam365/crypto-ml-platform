"use strict";

const PasswordResetProviderRegistryNodeRegistrySerializer = require("./passwordResetProviderRegistryNodeRegistrySerializer");

class PasswordResetProviderRegistryNodeRegistryDeserializer {
  constructor(options = {}) {
    this.serializer =
      options.serializer ||
      new PasswordResetProviderRegistryNodeRegistrySerializer();
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
      deserializer: "PasswordResetProviderRegistryNodeRegistryDeserializer",
      serializer: this.serializer.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeRegistryDeserializer;
