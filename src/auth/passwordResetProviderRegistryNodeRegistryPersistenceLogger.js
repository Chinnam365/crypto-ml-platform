"use strict";

class PasswordResetProviderRegistryNodeRegistryPersistenceLogger {
  constructor(options = {}) {
    this.level = options.level || "info";
    this.enabled = options.enabled !== false;
    this.maxEntries = Number.isInteger(options.maxEntries)
      ? options.maxEntries
      : 1000;

    this.entries = [];
  }

  log(level, message, metadata = {}) {
    if (!this.enabled) {
      return null;
    }

    const entry = {
      level,
      message,
      metadata,
      timestamp: new Date().toISOString()
    };

    this.entries.push(entry);

    if (this.entries.length > this.maxEntries) {
      this.entries.shift();
    }

    return entry;
  }

  trace(message, metadata = {}) {
    return this.log("trace", message, metadata);
  }

  debug(message, metadata = {}) {
    return this.log("debug", message, metadata);
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

  fatal(message, metadata = {}) {
    return this.log("fatal", message, metadata);
  }

  clear() {
    this.entries = [];
    return this;
  }

  getEntries() {
    return [...this.entries];
  }

  getLast(count = 10) {
    return this.entries.slice(-count);
  }

  setLevel(level) {
    this.level = level;
    return this;
  }

  enable() {
    this.enabled = true;
    return this;
  }

  disable() {
    this.enabled = false;
    return this;
  }

  isEnabled() {
    return this.enabled;
  }

  status() {
    return {
      logger:
        "PasswordResetProviderRegistryNodeRegistryPersistenceLogger",
      enabled: this.enabled,
      level: this.level,
      entries: this.entries.length,
      maxEntries: this.maxEntries,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceLogger;
