"use strict";

const fs = require("fs");
const path = require("path");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistrySerializer = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistrySerializer");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryDeserializer = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryDeserializer");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryBackup {
  constructor(options = {}) {
    this.serializer =
      options.serializer ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistrySerializer();

    this.deserializer =
      options.deserializer ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryDeserializer();
  }

  export(registry, filePath) {
    if (!(registry instanceof Map)) {
      throw new TypeError("Registry must be a Map.");
    }

    if (typeof filePath !== "string" || !filePath.trim()) {
      throw new TypeError("A valid file path is required.");
    }

    const absolutePath = path.resolve(filePath);

    fs.mkdirSync(path.dirname(absolutePath), {
      recursive: true
    });

    fs.writeFileSync(
      absolutePath,
      this.serializer.serialize(registry),
      "utf8"
    );

    return {
      success: true,
      file: absolutePath,
      exportedAt: new Date().toISOString()
    };
  }

  import(filePath) {
    if (typeof filePath !== "string" || !filePath.trim()) {
      throw new TypeError("A valid file path is required.");
    }

    const absolutePath = path.resolve(filePath);

    const content = fs.readFileSync(absolutePath, "utf8");

    return this.deserializer.deserialize(content);
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryBackup",
      healthy: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryBackup;
