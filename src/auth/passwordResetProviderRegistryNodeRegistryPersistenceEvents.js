"use strict";

const { EventEmitter } = require("events");

class PasswordResetProviderRegistryNodeRegistryPersistenceEvents extends EventEmitter {
  constructor(options = {}) {
    super();

    this.options = options;
    this.createdAt = new Date().toISOString();
  }

  emitConnected(payload = {}) {
    this.emit("persistence.connected", {
      timestamp: new Date().toISOString(),
      ...payload
    });
  }

  emitDisconnected(payload = {}) {
    this.emit("persistence.disconnected", {
      timestamp: new Date().toISOString(),
      ...payload
    });
  }

  emitSaved(payload = {}) {
    this.emit("persistence.saved", {
      timestamp: new Date().toISOString(),
      ...payload
    });
  }

  emitLoaded(payload = {}) {
    this.emit("persistence.loaded", {
      timestamp: new Date().toISOString(),
      ...payload
    });
  }

  emitBackupCreated(payload = {}) {
    this.emit("persistence.backup.created", {
      timestamp: new Date().toISOString(),
      ...payload
    });
  }

  emitRestored(payload = {}) {
    this.emit("persistence.restored", {
      timestamp: new Date().toISOString(),
      ...payload
    });
  }

  emitDeleted(payload = {}) {
    this.emit("persistence.deleted", {
      timestamp: new Date().toISOString(),
      ...payload
    });
  }

  emitError(error) {
    this.emit("persistence.error", {
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

  removeAllPersistenceListeners() {
    this.removeAllListeners("persistence.connected");
    this.removeAllListeners("persistence.disconnected");
    this.removeAllListeners("persistence.saved");
    this.removeAllListeners("persistence.loaded");
    this.removeAllListeners("persistence.backup.created");
    this.removeAllListeners("persistence.restored");
    this.removeAllListeners("persistence.deleted");
    this.removeAllListeners("persistence.error");
  }

  status() {
    const listenerCount = {};

    for (const eventName of this.eventNames()) {
      listenerCount[eventName] = this.listenerCount(eventName);
    }

    return {
      events: "PasswordResetProviderRegistryNodeRegistryPersistenceEvents",
      eventNames: this.eventNames(),
      listenerCount,
      createdAt: this.createdAt,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceEvents;
