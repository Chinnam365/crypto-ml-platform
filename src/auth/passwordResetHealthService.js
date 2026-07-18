"use strict";

class PasswordResetHealthService {
  constructor({
    repository,
    scheduler,
    metrics
  } = {}) {
    this.repository = repository || null;
    this.scheduler = scheduler || null;
    this.metrics = metrics || null;
  }

  getHealth() {
    const metrics =
      this.metrics &&
      typeof this.metrics.snapshot === "function"
        ? this.metrics.snapshot()
        : {};

    const repositoryCount =
      this.repository &&
      typeof this.repository.count === "function"
        ? this.repository.count()
        : null;

    const schedulerStatus =
      this.scheduler &&
      typeof this.scheduler.getStatus === "function"
        ? this.scheduler.getStatus()
        : {
            running: false,
            intervalMs: null
          };

    return {
      service: "PasswordReset",
      status: "UP",
      timestamp: new Date().toISOString(),
      repository: {
        available: !!this.repository,
        activeTokens: repositoryCount
      },
      scheduler: schedulerStatus,
      metrics
    };
  }

  isHealthy() {
    return {
      healthy: true,
      details: this.getHealth()
    };
  }
}

module.exports = PasswordResetHealthService;
