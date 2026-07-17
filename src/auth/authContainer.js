"use strict";

const registry = require("./authRegistry");

class AuthContainer {
  register(name, instance, options = {}) {
    return registry.register(
      name,
      instance,
      options
    );
  }

  resolve(name) {
    const component = registry.get(name);

    if (!component) {
      throw new Error(
        `Authentication component '${name}' is not registered.`
      );
    }

    return component;
  }

  has(name) {
    return registry.has(name);
  }

  remove(name) {
    registry.unregister(name);
  }

  list() {
    return registry.list();
  }

  initialize(components = {}) {
    for (const [name, component] of Object.entries(
      components
    )) {
      this.register(name, component, {
        autoRegistered: true
      });
    }

    return this.list();
  }

  shutdown() {
    registry.clear();

    return {
      success: true,
      timestamp: new Date().toISOString()
    };
  }

  statistics() {
    return {
      registeredComponents:
        registry.size(),
      components: registry.list(),
      generatedAt:
        new Date().toISOString()
    };
  }

  export() {
    return registry.export();
  }
}

module.exports = new AuthContainer();
