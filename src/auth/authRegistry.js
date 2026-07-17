"use strict";

class AuthRegistry {
  constructor() {
    this.components = new Map();
    this.metadata = new Map();
  }

  register(name, component, metadata = {}) {
    if (!name) {
      throw new Error("Component name is required.");
    }

    this.components.set(name, component);

    this.metadata.set(name, {
      name,
      registeredAt: new Date().toISOString(),
      ...metadata
    });

    return component;
  }

  unregister(name) {
    this.components.delete(name);
    this.metadata.delete(name);
  }

  get(name) {
    return this.components.get(name);
  }

  has(name) {
    return this.components.has(name);
  }

  metadataFor(name) {
    return this.metadata.get(name) || null;
  }

  names() {
    return [...this.components.keys()];
  }

  values() {
    return [...this.components.values()];
  }

  entries() {
    return [...this.components.entries()];
  }

  list() {
    return this.names().map(name => ({
      name,
      metadata: this.metadataFor(name)
    }));
  }

  clear() {
    this.components.clear();
    this.metadata.clear();
  }

  size() {
    return this.components.size;
  }

  export() {
    return {
      registeredComponents: this.list(),
      totalComponents: this.size(),
      exportedAt: new Date().toISOString()
    };
  }
}

module.exports = new AuthRegistry();
