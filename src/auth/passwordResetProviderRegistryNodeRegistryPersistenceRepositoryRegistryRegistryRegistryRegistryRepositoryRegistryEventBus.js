"use strict";

const { EventEmitter } = require("events");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryEventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100);
  }

  publish(event, payload = {}) {
    const message = {
      event,
      payload,
      timestamp: new Date().toISOString()
    };

    this.emit(event, message);

    return message;
  }

  subscribe(event, listener) {
    this.on(event, listener);

    return () => this.off(event, listener);
  }

  subscribeOnce(event, listener) {
    this.once(event, listener);
  }

  unsubscribe(event, listener) {
    this.off(event, listener);
  }

  removeAll(event) {
    if (event) {
      this.removeAllListeners(event);
    } else {
      this.removeAllListeners();
    }
  }

  listenerCountFor(event) {
    return this.listenerCount(event);
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryEventBus",
      healthy: true,
      events: this.eventNames(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryEventBus;
