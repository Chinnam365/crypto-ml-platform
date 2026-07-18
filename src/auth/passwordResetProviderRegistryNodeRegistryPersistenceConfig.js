"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceConstants = require("./passwordResetProviderRegistryNodeRegistryPersistenceConstants");

class PasswordResetProviderRegistryNodeRegistryPersistenceConfig {
  constructor(config = {}) {
    this.config = {
      name:
        config.name ||
        PasswordResetProviderRegistryNodeRegistryPersistenceConstants.NAME,

      version:
        config.version ||
        PasswordResetProviderRegistryNodeRegistryPersistenceConstants.VERSION,

      directory:
        config.directory ||
        PasswordResetProviderRegistryNodeRegistryPersistenceConstants.DEFAULT_DIRECTORY,

      filename:
        config.filename ||
        PasswordResetProviderRegistryNodeRegistryPersistenceConstants.DEFAULT_FILENAME,

      encoding:
        config.encoding ||
        PasswordResetProviderRegistryNodeRegistryPersistenceConstants.DEFAULT_FILE_ENCODING,

      timeoutMs:
        config.timeoutMs ||
        PasswordResetProviderRegistryNodeRegistryPersistenceConstants.DEFAULT_TIMEOUT_MS,

      backupExtension:
        config.backupExtension ||
        PasswordResetProviderRegistryNodeRegistryPersistenceConstants.DEFAULT_BACKUP_EXTENSION,

      maxBackups:
        config.maxBackups ||
        PasswordResetProviderRegistryNodeRegistryPersistenceConstants.DEFAULT_MAX_BACKUPS
    };
  }

  get(key) {
    return this.config[key];
  }

  set(key, value) {
    this.config[key] = value;
    return this;
  }

  has(key) {
    return Object.prototype.hasOwnProperty.call(this.config, key);
  }

  remove(key) {
    delete this.config[key];
    return this;
  }

  merge(config = {}) {
    this.config = {
      ...this.config,
      ...config
    };

    return this;
  }

  reset() {
    this.config = {
      name:
        PasswordResetProviderRegistryNodeRegistryPersistenceConstants.NAME,
      version:
        PasswordResetProviderRegistryNodeRegistryPersistenceConstants.VERSION,
      directory:
        PasswordResetProviderRegistryNodeRegistryPersistenceConstants.DEFAULT_DIRECTORY,
      filename:
        PasswordResetProviderRegistryNodeRegistryPersistenceConstants.DEFAULT_FILENAME,
      encoding:
        PasswordResetProviderRegistryNodeRegistryPersistenceConstants.DEFAULT_FILE_ENCODING,
      timeoutMs:
        PasswordResetProviderRegistryNodeRegistryPersistenceConstants.DEFAULT_TIMEOUT_MS,
      backupExtension:
        PasswordResetProviderRegistryNodeRegistryPersistenceConstants.DEFAULT_BACKUP_EXTENSION,
      maxBackups:
        PasswordResetProviderRegistryNodeRegistryPersistenceConstants.DEFAULT_MAX_BACKUPS
    };

    return this;
  }

  toJSON() {
    return {
      ...this.config
    };
  }

  status() {
    return {
      config:
        "PasswordResetProviderRegistryNodeRegistryPersistenceConfig",
      values: this.toJSON(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceConfig;
