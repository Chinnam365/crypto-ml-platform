"use strict";

class PasswordResetProviderReporter {
  constructor(manager) {
    this.manager = manager;
  }

  async generateReport() {
    const health =
      this.manager.getHealth();

    const metrics =
      this.manager.getMetrics();

    const diagnostics =
      this.manager.providerDiagnostics &&
      typeof this.manager.providerDiagnostics.run === "function"
        ? await this.manager.providerDiagnostics.run()
        : null;

    return {
      generatedAt: new Date().toISOString(),
      health,
      metrics,
      diagnostics
    };
  }

  async toJson() {
    return JSON.stringify(
      await this.generateReport(),
      null,
      2
    );
  }

  async toObject() {
    return this.generateReport();
  }

  async summary() {
    const report =
      await this.generateReport();

    return {
      generatedAt: report.generatedAt,
      status: report.health.status,
      providerCount:
        report.health.providerCount,
      metrics: report.metrics
    };
  }
}

module.exports = PasswordResetProviderReporter;
