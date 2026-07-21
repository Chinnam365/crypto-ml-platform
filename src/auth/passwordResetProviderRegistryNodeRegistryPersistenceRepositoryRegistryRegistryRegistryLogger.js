"use strict";

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryLogger {
  constructor(options = {}) {
    this.level = options.level || "info";
    this.historyLimit = Number(options.historyLimit) || 1000;
    this.history = [];
  }

  debug(message, metadata = {}) {
    return this.#log("debug", message, metadata);
  }

  info(message, metadata = {}) {
    return this.#log("info", message, metadata);
  }

  warn(message, metadata = {}) {
    return this.#log("warn", message, metadata);
  }

  error(message, metadata = {}) {
    return this.#log("error", message, metadata);
  }

  getHistory() {
    return [...this.history];
  }

  clear() {
    this.history.length = 0;
    return true;
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryLogger",
      level: this.level,
      entries: this.history.length,
      timestamp: new Date().toISOString()
    };
  }

  #log(level, message, metadata) {
    const entry = {
      level,
      message,
      metadata,
      timestamp: new Date().toISOString()
    };

    this.history.push(entry);

    if (this.history.length > this.historyLimit) {
      this.history.shift();
    }

    const method =
      typeof console[level] === "function" ? level : "log";

    console[method](
      `[${entry.timestamp}] [${level.toUpperCase()}] ${message}`,
      metadata
    );

    return entry;
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryLogger;
