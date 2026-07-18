"use strict";

class PasswordResetProviderRegistryDiagnostics {
  constructor(registry) {
    this.registry = registry;
  }

  async run() {
    const diagnostics = [];

    for (const entry of this.registry.entries()) {
      const provider = entry.provider;

      const diagnostic = {
        name: entry.name,
        configured: entry.configured,
        providerName:
          typeof provider?.getName === "function"
            ? provider.getName()
            : entry.name,
        supportsConnectionCheck:
          typeof provider?.verifyConnection === "function",
        connected: false,
        error: null,
        timestamp: new Date().toISOString()
      };

      try {
        if (
          typeof provider?.verifyConnection === "function"
        ) {
          const result =
            await provider.verifyConnection();

          diagnostic.connected =
            !!result.connected;

          diagnostic.connection =
            result;
        } else {
          diagnostic.connected =
            entry.configured;
        }
      } catch (error) {
        diagnostic.connected = false;
        diagnostic.error = error.message;
      }

      diagnostics.push(diagnostic);
    }

    return {
      registrySize:
        this.registry.size(),
      healthyProviders:
        diagnostics.filter(
          provider => provider.connected
        ).length,
      unhealthyProviders:
        diagnostics.filter(
          provider => !provider.connected
        ).length,
      generatedAt:
        new Date().toISOString(),
      providers: diagnostics
    };
  }
}

module.exports =
  PasswordResetProviderRegistryDiagnostics;
