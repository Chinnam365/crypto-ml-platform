"use strict";

class PasswordResetScheduler {
  constructor(
    repository,
    options = {}
  ) {
    if (!repository) {
      throw new Error(
        "PasswordResetRepository is required."
      );
    }

    this.repository = repository;
    this.intervalMs =
      options.intervalMs ||
      5 * 60 * 1000;

    this.timer = null;
  }

  start() {
    if (this.timer) {
      return;
    }

    this.timer = setInterval(() => {
      this.runCleanup();
    }, this.intervalMs);

    if (typeof this.timer.unref === "function") {
      this.timer.unref();
    }
  }

  stop() {
    if (!this.timer) {
      return;
    }

    clearInterval(this.timer);
    this.timer = null;
  }

  runCleanup() {
    return this.repository.cleanup(Date.now());
  }

  isRunning() {
    return this.timer !== null;
  }

  getStatus() {
    return {
      running: this.isRunning(),
      intervalMs: this.intervalMs
    };
  }
}

module.exports = PasswordResetScheduler;
