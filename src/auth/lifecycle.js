"use strict";

const bootstrap = require("./bootstrap");
const authModuleRegistry = require("./authModuleRegistry");
const authStatistics = require("./authStatistics");
const authDiagnostics = require("./authDiagnostics");

class AuthenticationLifecycle {
  constructor() {
    this.started = false;
    this.startedAt = null;
  }

  async start() {
    if (this.started) {
      return {
        success: true,
        message: "Authentication module already running.",
        startedAt: this.startedAt
      };
    }

    const result = await bootstrap.initialize();

    this.started = true;
    this.startedAt = new Date().toISOString();

    return {
      success: true,
      startedAt: this.startedAt,
      initialization: result
    };
  }

  async stop() {
    if (!this.started) {
      return {
        success: true,
        message: "Authentication module already stopped."
      };
    }

    await bootstrap.shutdown();

    this.started = false;

    return {
      success: true,
      stoppedAt: new Date().toISOString()
    };
  }

  async restart() {
    await this.stop();
    return this.start();
  }

  status() {
    return {
      running: this.started,
      startedAt: this.startedAt,
      registeredModules:
        authModuleRegistry.list(),
      diagnostics:
        authDiagnostics.health(),
      statistics:
        authStatistics.getHealth(),
      timestamp:
        new Date().toISOString()
    };
  }
}

module.exports = new AuthenticationLifecycle();
