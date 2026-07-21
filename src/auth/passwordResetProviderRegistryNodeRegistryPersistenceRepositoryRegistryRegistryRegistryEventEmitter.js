"use strict";

const { EventEmitter } = require("events");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryEventEmitter {
  constructor(options = {}) {
    this.emitter = options.emitter || new EventEmitter();
    this.maxListeners = Number(options.maxListeners) || 100;

    this.emitter.setMaxListeners(this.maxListeners);
  }

  on(event, listener) {
    this.emitter.on(event, listener);
    return this;
  }

  once(event, listener) {
    this.emitter.once(event, listener);
    return this;
  }

  off(event, listener) {
    this.emitter.off(event, listener);
    return this;
  }

  emit(event, payload = {}) {
    return this.emitter.emit(event, {
      ...payload,
      timestamp: new Date().toISOString()
    });
  }

  listenerCount(event) {
    return this.emitter.listenerCount(event);
  }

  eventNames() {
    return this.emitter.eventNames();
  }

  removeAllListeners(event) {
    this.emitter.removeAllListeners(event);
    return this;
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryEventEmitter",
      maxListeners: this.maxListeners,
      registeredEvents: this.eventNames(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryEventEmitter;
