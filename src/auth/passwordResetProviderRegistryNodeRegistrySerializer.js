"use strict";

class PasswordResetProviderRegistryNodeRegistrySerializer {
  serialize(record) {
    if (record === null || record === undefined) {
      return null;
    }

    return JSON.stringify(record);
  }

  deserialize(payload) {
    if (payload === null || payload === undefined) {
      return null;
    }

    if (typeof payload === "object") {
      return payload;
    }

    return JSON.parse(payload);
  }

  serializeCollection(records = []) {
    if (!Array.isArray(records)) {
      throw new TypeError("Expected an array of registry records.");
    }

    return JSON.stringify(records);
  }

  deserializeCollection(payload) {
    if (payload === null || payload === undefined) {
      return [];
    }

    const records =
      typeof payload === "string"
        ? JSON.parse(payload)
        : payload;

    if (!Array.isArray(records)) {
      throw new TypeError("Serialized collection must resolve to an array.");
    }

    return records;
  }

  clone(record) {
    return this.deserialize(this.serialize(record));
  }

  status() {
    return {
      serializer: "PasswordResetProviderRegistryNodeRegistrySerializer",
      format: "json",
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeRegistrySerializer;
