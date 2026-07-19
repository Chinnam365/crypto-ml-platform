"use strict";

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositorySerializer {
  serialize(record = {}) {
    return JSON.stringify(record);
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

  serializeCollection(records = []) {
    if (!Array.isArray(records)) {
      throw new TypeError("records must be an array.");
    }

    return JSON.stringify(records);
  }

  deserializeCollection(serialized) {
    if (serialized === null || serialized === undefined) {
      return [];
    }

    const records =
      typeof serialized === "string"
        ? JSON.parse(serialized)
        : serialized;

    if (!Array.isArray(records)) {
      throw new TypeError("Serialized data must contain an array.");
    }

    return records;
  }

  clone(record = {}) {
    return this.deserialize(this.serialize(record));
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositorySerializer",
      format: "json",
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositorySerializer;
