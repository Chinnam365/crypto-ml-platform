"use strict";

const logger = require("../config/logger");

const authModuleRegistry = require("./authModuleRegistry");
const authEventListeners = require("./authEventListeners");
const authBootstrap = require("./authBootstrap");
const authHealthService = require("./authHealthService");

class AuthenticationBootstrap {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) {
      return {
        success: true,
        initialized: true
      };
    }

    logger.info(
      "Initializing Authentication Module..."
    );

    authModuleRegistry.registerDefaults();

    if (
      typeof authBootstrap.initialize ===
      "function"
    ) {
      await authBootstrap.initialize();
    }

    authEventListeners.initialize();

    this.initialized = true;

    logger.info(
      "Authentication Module initialized successfully."
    );

    return {
      success: true,
      initialized: true,
      health:
        typeof authHealthService.getHealth ===
        "function"
          ? await authHealthService.getHealth()
          : null,
      timestamp: new Date().toISOString()
    };
  }

  async shutdown() {
    if (!this.initialized) {
      return;
    }

    logger.info(
      "Shutting down Authentication Module..."
    );

    authEventListeners.shutdown();

    authModuleRegistry.shutdown();

    this.initialized = false;

    logger.info(
      "Authentication Module stopped."
    );

    return {
      success: true,
      timestamp: new Date().toISOString()
    };
  }

  isInitialized() {
    return this.initialized;
  }
}

module.exports = new AuthenticationBootstrap();
