"use strict";

const fs = require("fs");
const path = require("path");
const RepositorySerializer = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositorySerializer");
const Repository = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepository");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryBackup {
  constructor(options = {}) {
    this.serializer =
      options.serializer || new RepositorySerializer();
  }

  export(repository, filePath) {
    if (!(repository instanceof Repository)) {
      throw new TypeError("Invalid repository instance.");
    }

    const target = path.resolve(filePath);

    fs.mkdirSync(path.dirname(target), { recursive: true });

    fs.writeFileSync(
      target,
      this.serializer.serialize(repository),
      "utf8"
    );

    return {
      success: true,
      path: target,
      exportedAt: new Date().toISOString()
    };
  }

  import(repository, filePath) {
    if (!(repository instanceof Repository)) {
      throw new TypeError("Invalid repository instance.");
    }

    const target = path.resolve(filePath);

    const content = fs.readFileSync(target, "utf8");

    this.serializer.deserialize(content, repository);

    return repository;
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryBackup",
      healthy: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryBackup;
