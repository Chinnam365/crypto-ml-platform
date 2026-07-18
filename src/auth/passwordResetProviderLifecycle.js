"use strict";

class PasswordResetProviderLifecycle {
  constructor(manager) {
    this.manager = manager;
    this.started = false;
    this.startedAt = null;
    this.stoppedAt = null;
  }

  async start() {
    if (this.started) {
      return this.status();
    }

    for (const providerName of this.manager.list()) {
      const provider = this.manager.get(providerName);

      if (
        provider &&
        typeof provider.initialize === "function"
      ) {
        await provider.initialize();
      }
    }

    this.started = true;
    this.startedAt = new Date().toISOString();
    this.stoppedAt = null;

    return this.status();
  }

  async stop() {
    if (!this.started) {
      return this.status();
    }

    for (const providerName of this.manager.list()) {
      const provider = this.manager.get(providerName);

      if (
        provider &&
        typeof provider.shutdown === "function"
      ) {
        await provider.shutdown();
      }
    }

    this.started = false;
    this.stoppedAt = new Date().toISOString();

    return this.status();
  }

  async restart() {
    await this.stop();
    return this.start();
  }

  status() {
    return {
      running: this.started,
      startedAt: this.startedAt,
      stoppedAt: this.stoppedAt,
      providerCount: this.manager.list().length
    };
  }
}

module.exports = PasswordResetProviderLifecycle;
