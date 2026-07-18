"use strict";

class PasswordResetProviderChain {
  constructor() {
    this.providers = [];
  }

  add(name, provider) {
    this.providers.push({
      name,
      provider
    });

    return this;
  }

  remove(name) {
    this.providers = this.providers.filter(
      provider => provider.name !== name
    );

    return this;
  }

  async execute(message = {}) {
    const results = [];

    for (const entry of this.providers) {
      try {
        const result = await entry.provider.send(
          message
        );

        results.push({
          provider: entry.name,
          success: true,
          result
        });
      } catch (error) {
        results.push({
          provider: entry.name,
          success: false,
          error: error.message
        });
      }
    }

    return results;
  }

  getProviders() {
    return this.providers.map(provider => ({
      name: provider.name
    }));
  }

  clear() {
    this.providers = [];
  }

  size() {
    return this.providers.length;
  }
}

module.exports = PasswordResetProviderChain;
