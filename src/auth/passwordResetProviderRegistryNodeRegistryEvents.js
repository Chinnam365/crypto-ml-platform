"use strict";

const { EventEmitter } = require("events");

class PasswordResetProviderRegistryNodeRegistryEvents extends EventEmitter {
  constructor(options = {}) {
    super();

    this.options = options;
    this.createdAt = new Date().toISOString();
  }

  emitInitialized(payload = {}) {
    this.emit("registry.initialized", {
      timestamp: new Date().toISOString(),
      ...payload
    });
  }

  emitStarted(payload = {}) {
    this.emit("registry.started", {
      timestamp: new Date().toISOString(),
      ...payload
    });
  }

  emitStopped(payload = {}) {
    this.emit("registry.stopped", {
      timestamp: new Date().toISOString(),
      ...payload
    });
  }

  emitHealthChanged(payload = {}) {
    this.emit("registry.healthChanged", {
      timestamp: new Date().toISOString(),
      ...payload
    });
  }

  emitNodeRegistered(payload = {}) {
    this.emit("registry.nodeRegistered", {
      timestamp: new Date().toISOString(),
      ...payload
    });
  }

  emitNodeUpdated(payload = {}) {
    this.emit("registry.nodeUpdated", {
      timestamp: new Date().toISOString(),
      ...payload
    });
  }

  emitNodeUnregistered(payload = {}) {
    this.emit("registry.nodeUnregistered", {
      timestamp: new Date().toISOString(),
      ...payload
    });
  }

  emitError(error) {
    this.emit("registry.error", {
      timestamp: new Date().toISOString(),
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack
            }
          : error
    });
  }

  removeAllRegistryListeners() {
    this.removeAllListeners("registry.initialized");
    this.removeAllListeners("registry.started");
    this.removeAllListeners("registry.stopped");
    this.removeAllListeners("registry.healthChanged");
    this.removeAllListeners("registry.nodeRegistered");
    this.removeAllListeners("registry.nodeUpdated");
    this.removeAllListeners("registry.nodeUnregistered");
    this.removeAllListeners("registry.error");
  }

  status() {
    return {
      events: "PasswordResetProviderRegistryNodeRegistryEvents",
      eventNames: this.eventNames(),
      listenerCount: this.eventNames().reduce((result, event) => {
        result[event] = this.listenerCount(event);
        return result;
      }, {}),
      createdAt: this.createdAt,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeRegistryEvents;
