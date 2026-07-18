"use strict";

class PasswordResetProviderRegistrySnapshot {
  constructor(registry, factory) {
    this.registry = registry;
    this.factory = factory;
  }

  create() {
    return {
      version: "1.0.0",
      createdAt: new Date().toISOString(),
      providers: this.registry.entries().map(entry => ({
        name: entry.name,
        configured: entry.configured,
        providerName:
          typeof entry.provider?.getName === "function"
            ? entry.provider.getName()
            : entry.name
      }))
    };
  }

  restore(snapshot = {}) {
    const restored = [];

    for (const provider of snapshot.providers || []) {
      if (this.registry.has(provider.name)) {
        continue;
      }

      const instance = this.factory.create(
        provider.name
      );

      this.registry.register(
        provider.name,
        instance
      );

      restored.push(provider.name);
    }

    return {
      success: true,
      restored,
      restoredCount: restored.length,
      restoredAt: new Date().toISOString()
    };
  }

  compare(snapshot = {}) {
    const current = new Set(this.registry.list());

    const previous = new Set(
      (snapshot.providers || []).map(
        provider => provider.name
      )
    );

    return {
      added: [...current].filter(
        name => !previous.has(name)
      ),
      removed: [...previous].filter(
        name => !current.has(name)
      ),
      unchanged: [...current].filter(
        name => previous.has(name)
      )
    };
  }
}

module.exports =
  PasswordResetProviderRegistrySnapshot;
