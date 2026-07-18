"use strict";

class PasswordResetProviderRegistry {
  constructor() {
    this.providers = new Map();
  }

  register(name, provider) {
    if (!name) {
      throw new Error("Provider name is required.");
    }

    if (!provider) {
      throw new Error("Provider instance is required.");
    }

    this.providers.set(name, provider);

    return provider;
  }

  unregister(name) {
    return this.providers.delete(name);
  }

  get(name) {
    return this.providers.get(name) || null;
  }

  has(name) {
    return this.providers.has(name);
  }

  list() {
    return Array.from(this.providers.keys());
  }

  entries() {
    return Array.from(this.providers.entries()).map(
      ([name, provider]) => ({
        name,
        configured:
          typeof provider.isConfigured === "function"
            ? provider.isConfigured()
            : true,
        provider
      })
    );
  }

  clear() {
    this.providers.clear();
  }

  size() {
    return this.providers.size;
  }
}

module.exports = PasswordResetProviderRegistry;
