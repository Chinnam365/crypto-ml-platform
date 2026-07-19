"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryConstants = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryConstants");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryLogger {
  constructor(options = {}) {
    this.namespace =
      options.namespace ||
      PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryConstants.DEFAULT_NAMESPACE;

    this.enabled =
      options.enabled !== undefined ? options.enabled : true;

    this.history = [];
  }

  log(level, message, metadata = {}) {
    if (!this.enabled) {
      return null;
    }

    const entry = {
      level,
      namespace: this.namespace,
      message,
      metadata,
      timestamp: new Date().toISOString()
    };

    this.history.push(entry);

    return entry;
  }

  info(message, metadata = {}) {
    return this.log("info", message, metadata);
  }

  warn(message, metadata = {}) {
    return this.log("warn", message, metadata);
  }

  error(message, metadata = {}) {
    return this.log("error", message, metadata);
  }

  debug(message, metadata = {}) {
    return this.log("debug", message, metadata);
  }

  getHistory() {
    return [...this.history];
  }

  clear() {
    this.history.length = 0;
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryLogger",
      enabled: this.enabled,
      entries: this.history.length,
      namespace: this.namespace,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryLogger;
