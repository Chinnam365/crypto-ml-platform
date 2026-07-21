"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryConstants = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryConstants");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryEvents {
  constructor() {
    this.events = new Map();

    Object.values(
      PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryConstants.EVENTS
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

  once(eventName, listener) {
    const wrapper = (payload) => {
      this.off(eventName, wrapper);
      listener(payload);
    };

    return this.on(eventName, wrapper);
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
      return this;
    }

    this.events.clear();

    Object.values(
      PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryConstants.EVENTS
    ).forEach((name) => {
      this.events.set(name, []);
    });

    return this;
  }

  registeredEvents() {
    return [...this.events.keys()];
  }

  listenerCount(eventName) {
    return (this.events.get(eventName) || []).length;
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryEvents",
      registeredEvents: this.registeredEvents(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryEvents;
