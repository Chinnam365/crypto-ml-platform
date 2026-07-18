"use strict";

class PasswordResetProviderRegistryReporter {
  constructor(registry) {
    this.registry = registry;
  }

  async generateReport() {
    const providers = [];

    for (const entry of this.registry.entries()) {
      const provider = entry.provider;

      let verification = {
        connected: false
      };

      try {
        if (
          provider &&
          typeof provider.verifyConnection === "function"
        ) {
          verification =
            await provider.verifyConnection();
        }
      } catch (error) {
        verification = {
          connected: false,
          error: error.message
        };
      }

      providers.push({
        name: entry.name,
        configured: entry.configured,
        providerName:
          typeof provider?.getName === "function"
            ? provider.getName()
            : entry.name,
        connected: verification.connected,
        verification
      });
    }

    const connectedProviders =
      providers.filter(
        provider => provider.connected
      ).length;

    return {
      generatedAt: new Date().toISOString(),
      totalProviders: providers.length,
      connectedProviders,
      disconnectedProviders:
        providers.length -
        connectedProviders,
      status:
        connectedProviders === providers.length
          ? "UP"
          : connectedProviders > 0
          ? "DEGRADED"
          : "DOWN",
      providers
    };
  }

  async summary() {
    const report =
      await this.generateReport();

    return {
      status: report.status,
      totalProviders:
        report.totalProviders,
      connectedProviders:
        report.connectedProviders,
      generatedAt:
        report.generatedAt
    };
  }
}

module.exports =
  PasswordResetProviderRegistryReporter;
