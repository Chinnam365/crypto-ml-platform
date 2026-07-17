"use strict";

const container = require("./authContainer");

class DependencyGraph {
  constructor() {
    this.graph = new Map();
  }

  register(moduleName, dependencies = []) {
    this.graph.set(moduleName, [...dependencies]);

    return this;
  }

  dependencies(moduleName) {
    return this.graph.get(moduleName) || [];
  }

  dependents(moduleName) {
    const result = [];

    for (const [module, deps] of this.graph.entries()) {
      if (deps.includes(moduleName)) {
        result.push(module);
      }
    }

    return result;
  }

  has(moduleName) {
    return this.graph.has(moduleName);
  }

  validate() {
    const missing = [];

    for (const [module, deps] of this.graph.entries()) {
      for (const dependency of deps) {
        if (!container.has(dependency)) {
          missing.push({
            module,
            missingDependency: dependency
          });
        }
      }
    }

    return {
      valid: missing.length === 0,
      missing
    };
  }

  export() {
    return {
      generatedAt: new Date().toISOString(),
      modules: [...this.graph.entries()].map(
        ([module, dependencies]) => ({
          module,
          dependencies
        })
      )
    };
  }

  clear() {
    this.graph.clear();
  }

  size() {
    return this.graph.size;
  }
}

module.exports = new DependencyGraph();
