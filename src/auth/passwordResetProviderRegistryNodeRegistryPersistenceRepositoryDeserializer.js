"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositorySerializer = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositorySerializer");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryDeserializer {
  constructor(options = {}) {
    this.serializer =
      options.serializer ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositorySerializer(
        options
      );
  }

  deserialize(serialized) {
    return this.serializer.deserialize(serialized);
  }

  deserializeCollection(serialized) {
    return this.serializer.deserializeCollection(serialized);
  }

  deserializeSafe(serialized) {
    try {
      return {
        success: true,
        data: this.deserialize(serialized)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  deserializeCollectionSafe(serialized) {
    try {
      return {
        success: true,
        data: this.deserializeCollection(serialized)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  isSerialized(value) {
    return typeof value === "string";
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryDeserializer",
      serializer: this.serializer.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryDeserializer;
