"use strict";

class PasswordResetProviderSnapshot {
  constructor(manager) {
    this.manager = manager;
  }

  create() {
    const providers = this.manager
      .list()
      .map(name => {
        const provider = this.manager.get(name);

        return {
          name,
          configured:
            typeof provider.isConfigured === "function"
              ? provider.isConfigured()
              : true,
          providerName:
            typeof provider.getName === "function"
              ? provider.getName()
              : name
        };
      });

    return {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      providerCount: providers.length,
      providers
    };
  }

  restore(snapshot = {}) {
    const restored = [];

    for (const provider of snapshot.providers || []) {
      if (!this.manager.get(provider.name)) {
        this.manager.register(provider.name);
        restored.push(provider.name);
      }
    }

    return {
      restored,
      restoredCount: restored.length
    };
  }

  compare(snapshot = {}) {
    const current = new Set(this.manager.list());
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

module.exports = PasswordResetProviderSnapshot;
