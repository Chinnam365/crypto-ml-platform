"use strict";

class PasswordResetProviderHealth {
  constructor(registry) {
    this.registry = registry;
  }

  getHealth() {
    const providers = [];

    if (
      this.registry &&
      typeof this.registry.entries === "function"
    ) {
      for (const entry of this.registry.entries()) {
        providers.push({
          name: entry.name,
          configured: entry.configured,
          status: entry.configured
            ? "READY"
            : "NOT_CONFIGURED"
        });
      }
    }

    const healthy = providers.every(
      provider => provider.status === "READY"
    );

    return {
      status: healthy ? "UP" : "DEGRADED",
      providerCount: providers.length,
      providers,
      timestamp: new Date().toISOString()
    };
  }

  async verifyProviders() {
    const results = [];

    if (
      this.registry &&
      typeof this.registry.entries === "function"
    ) {
      for (const entry of this.registry.entries()) {
        let verification = {
          connected: false
        };

        if (
          entry.provider &&
          typeof entry.provider.verifyConnection === "function"
        ) {
          verification =
            await entry.provider.verifyConnection();
        }

        results.push({
          name: entry.name,
          configured: entry.configured,
          ...verification
        });
      }
    }

    return results;
  }
}

module.exports = PasswordResetProviderHealth;
