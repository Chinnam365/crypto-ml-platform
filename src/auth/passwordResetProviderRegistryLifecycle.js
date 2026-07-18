"use strict";

class PasswordResetProviderRegistryLifecycle {
  constructor(registry) {
    this.registry = registry;
    this.running = false;
    this.startedAt = null;
    this.stoppedAt = null;
  }

  async start() {
    if (this.running) {
      return this.status();
    }

    for (const entry of this.registry.entries()) {
      const provider = entry.provider;

      if (
        provider &&
        typeof provider.initialize === "function"
      ) {
        await provider.initialize();
      }
    }

    this.running = true;
    this.startedAt = new Date().toISOString();
    this.stoppedAt = null;

    return this.status();
  }

  async stop() {
    if (!this.running) {
      return this.status();
    }

    for (const entry of this.registry.entries()) {
      const provider = entry.provider;

      if (
        provider &&
        typeof provider.shutdown === "function"
      ) {
        await provider.shutdown();
      }
    }

    this.running = false;
    this.stoppedAt = new Date().toISOString();

    return this.status();
  }

  async restart() {
    await this.stop();
    return this.start();
  }

  status() {
    return {
      running: this.running,
      startedAt: this.startedAt,
      stoppedAt: this.stoppedAt,
      providerCount: this.registry.size(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryLifecycle;
