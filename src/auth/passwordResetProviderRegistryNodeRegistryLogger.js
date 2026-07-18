"use strict";

class PasswordResetProviderRegistryNodeRegistryLogger {
  constructor(options = {}) {
    this.level = options.level || "info";
    this.enabled = options.enabled !== false;
    this.history = [];
    this.maxHistory = options.maxHistory || 1000;
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

    this.history.push(entry);

    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

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

  clear() {
    this.history = [];
    return this;
  }

  getHistory() {
    return [...this.history];
  }

  getLast(count = 10) {
    return this.history.slice(-count);
  }

  status() {
    return {
      logger: "PasswordResetProviderRegistryNodeRegistryLogger",
      enabled: this.enabled,
      level: this.level,
      entries: this.history.length,
      maxHistory: this.maxHistory,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeRegistryLogger;
