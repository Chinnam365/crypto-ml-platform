"use strict";

const fs = require("fs");
const path = require("path");

const RepositoryRegistrySerializer = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistrySerializer");
const RepositoryRegistryDeserializer = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryDeserializer");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryBackup {
  constructor(options = {}) {
    this.serializer =
      options.serializer || new RepositoryRegistrySerializer();

    this.deserializer =
      options.deserializer || new RepositoryRegistryDeserializer();
  }

  export(repositoryRegistry, filePath) {
    const target = path.resolve(filePath);

    fs.mkdirSync(path.dirname(target), {
      recursive: true
    });

    fs.writeFileSync(
      target,
      this.serializer.serialize(repositoryRegistry),
      "utf8"
    );

    return {
      success: true,
      file: target,
      exportedAt: new Date().toISOString()
    };
  }

  import(repositoryRegistry, filePath) {
    const target = path.resolve(filePath);

    const content = fs.readFileSync(target, "utf8");

    return this.deserializer.deserializeInto(
      repositoryRegistry,
      content
    );
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryBackup",
      healthy: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryBackup;
