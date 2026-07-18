"use strict";

class PasswordResetProviderDiagnostics {
  constructor(manager) {
    this.manager = manager;
  }

  async run() {
    const providers = this.manager.list();

    const diagnostics = [];

    for (const providerName of providers) {
      const provider = this.manager.get(providerName);

      let configured = false;
      let connected = false;
      let error = null;

      try {
        configured =
          typeof provider.isConfigured === "function"
            ? provider.isConfigured()
            : true;

        if (
          configured &&
          typeof provider.verifyConnection === "function"
        ) {
          const result =
            await provider.verifyConnection();

          connected = !!result.connected;
        }
      } catch (err) {
        error = err.message;
      }

      diagnostics.push({
        provider: providerName,
        configured,
        connected,
        healthy: configured && connected,
        error
      });
    }

    return {
      timestamp: new Date().toISOString(),
      providers: diagnostics,
      overallHealthy: diagnostics.every(
        provider => provider.healthy
      )
    };
  }
}

module.exports = PasswordResetProviderDiagnostics;
