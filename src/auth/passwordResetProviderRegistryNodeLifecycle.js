"use strict";

const PasswordResetProviderRegistryNodeVersionManager = require("./passwordResetProviderRegistryNodeVersionManager");

class PasswordResetProviderRegistryNodeLifecycle {
  constructor(options = {}) {
    this.versionManager =
      options.versionManager ||
      new PasswordResetProviderRegistryNodeVersionManager(options);

    this.state = "created";
    this.history = [];
  }

  transition(state) {
    this.state = state;

    const event = {
      state,
      timestamp: new Date().toISOString()
    };

    this.history.push(event);

    return event;
  }

  start() {
    this.transition("starting");
    this.versionManager.createVersion("startup");
    return this.transition("running");
  }

  stop() {
    return this.transition("stopped");
  }

  restart() {
    this.transition("restarting");
    this.versionManager.createVersion("restart");
    return this.transition("running");
  }

  fail() {
    return this.transition("failed");
  }

  recover() {
    this.transition("recovering");
    return this.transition("running");
  }

  getState() {
    return this.state;
  }

  getHistory() {
    return [...this.history];
  }

  status() {
    return {
      state: this.state,
      historyLength: this.history.length,
      currentVersion:
        this.versionManager.getCurrentVersion(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeLifecycle;
