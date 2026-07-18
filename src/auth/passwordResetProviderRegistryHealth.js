"use strict";

class PasswordResetProviderRegistryHealth {
  constructor(registry) {
    this.registry = registry;
  }

  async check() {
    const providers = this.registry.entries();

    const details = [];

    for (const entry of providers) {
      const provider = entry.provider;

      let healthy = true;
      let connection = null;

      try {
        if (
          provider &&
          typeof provider.verifyConnection === "function"
        ) {
          connection =
            await provider.verifyConnection();

          healthy = !!connection.connected;
        }
      } catch (error) {
        healthy = false;

        connection = {
          connected: false,
          error: error.message
        };
      }

      details.push({
        name: entry.name,
        configured: entry.configured,
        healthy,
        connection
      });
    }

    const healthyCount = details.filter(
      provider => provider.healthy
    ).length;

    return {
      status:
        healthyCount === details.length
          ? "UP"
          : healthyCount > 0
          ? "DEGRADED"
          : "DOWN",
      totalProviders: details.length,
      healthyProviders: healthyCount,
      unhealthyProviders:
        details.length - healthyCount,
      timestamp: new Date().toISOString(),
      providers: details
    };
  }
}

module.exports =
  PasswordResetProviderRegistryHealth;
