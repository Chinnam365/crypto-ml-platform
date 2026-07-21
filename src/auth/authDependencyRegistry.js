"use strict";

class AuthDependencyRegistry {
  constructor() {
    this.dependencies = new Map();
  }

  register(name, dependency) {
    if (typeof name !== "string" || !name.trim()) {
      throw new TypeError("Dependency name must be a non-empty string.");
    }

    this.dependencies.set(name.trim(), dependency);

    return dependency;
  }

  resolve(name) {
    return this.dependencies.get(name) || null;
  }

  has(name) {
    return this.dependencies.has(name);
  }

  unregister(name) {
    return this.dependencies.delete(name);
  }

  list() {
    return Array.from(this.dependencies.keys());
  }

  entries() {
    return Array.from(this.dependencies.entries()).map(
      ([name, dependency]) => ({
        name,
        dependency
      })
    );
  }

  clear() {
    this.dependencies.clear();
  }

  size() {
    return this.dependencies.size;
  }

  status() {
    return {
      component: "AuthDependencyRegistry",
      healthy: true,
      dependencies: this.size(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = AuthDependencyRegistry;
