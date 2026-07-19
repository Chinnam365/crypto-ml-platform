"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryConstants = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryConstants");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryEvents {
  constructor() {
    this.events = new Map();

    Object.values(
      PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryConstants.EVENTS
    ).forEach((eventName) => {
      this.events.set(eventName, []);
    });
  }

  on(eventName, listener) {
    if (typeof listener !== "function") {
      throw new TypeError("listener must be a function.");
    }

    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    this.events.get(eventName).push(listener);

    return this;
  }

  off(eventName, listener) {
    if (!this.events.has(eventName)) {
      return this;
    }

    this.events.set(
      eventName,
      this.events.get(eventName).filter((fn) => fn !== listener)
    );

    return this;
  }

  emit(eventName, payload = {}) {
    const listeners = this.events.get(eventName) || [];

    for (const listener of listeners) {
      listener(payload);
    }

    return listeners.length;
  }

  clear(eventName) {
    if (eventName) {
      this.events.set(eventName, []);
      return;
    }

    this.events.clear();
  }

  registeredEvents() {
    return [...this.events.keys()];
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryEvents",
      registeredEvents: this.registeredEvents(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryEvents;
