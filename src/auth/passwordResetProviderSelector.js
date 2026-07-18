"use strict";

class PasswordResetProviderSelector {
  constructor(registry) {
    this.registry = registry;
  }

  select(type) {
    if (!this.registry) {
      return null;
    }

    const provider = this.registry.get(type);

    if (!provider) {
      return null;
    }

    if (
      typeof provider.isConfigured === "function" &&
      !provider.isConfigured()
    ) {
      return null;
    }

    return provider;
  }

  selectAvailable(types = []) {
    const providers = [];

    for (const type of types) {
      const provider = this.select(type);

      if (provider) {
        providers.push({
          type,
          provider
        });
      }
    }

    return providers;
  }

  selectPreferred(preferred = []) {
    for (const type of preferred) {
      const provider = this.select(type);

      if (provider) {
        return {
          type,
          provider
        };
      }
    }

    return null;
  }

  hasAvailable(type) {
    return this.select(type) !== null;
  }

  availableTypes() {
    if (
      !this.registry ||
      typeof this.registry.entries !== "function"
    ) {
      return [];
    }

    return this.registry
      .entries()
      .filter(entry => entry.configured)
      .map(entry => entry.name);
  }
}

module.exports = PasswordResetProviderSelector;
