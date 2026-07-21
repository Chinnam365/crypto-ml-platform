"use strict";

const { EventEmitter } = require("events");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryEventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100);
  }

  publish(event, payload = {}) {
    this.emit(event, {
      event,
      payload,
      timestamp: new Date().toISOString()
    });
  }

  subscribe(event, listener) {
    this.on(event, listener);
    return () => this.off(event, listener);
  }

  subscribeOnce(event, listener) {
    this.once(event, listener);
  }

  listenerCountFor(event) {
    return this.listenerCount(event);
  }

  removeAllSubscriptions(event) {
    if (event) {
      this.removeAllListeners(event);
    } else {
      this.removeAllListeners();
    }
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryEventBus",
      healthy: true,
      eventNames: this.eventNames(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryEventBus;
