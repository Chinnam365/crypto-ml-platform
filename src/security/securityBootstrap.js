"use strict";

const logger = require("../config/logger");
const config = require("../config/environment");
const database = require("../config/database");
const redis = require("../config/redis");
const secretManager = require("./secretManager");
const emergencyStopService = require("./emergencyStopService");

class SecurityBootstrap {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) {
      return;
    }

    logger.info("Initializing Security Layer...");

    await this.validateEnvironment();
    await this.validateDatabase();
    await this.validateRedis();
    await this.validateOwnerSecrets();
    await this.validateEmergencyState();

    this.initialized = true;

    logger.info("Security Layer Initialized.");
  }

  async validateEnvironment() {
    if (!config.jwt.accessSecret) {
      throw new Error("JWT_ACCESS_SECRET missing.");
    }

    if (!config.jwt.refreshSecret) {
      throw new Error("JWT_REFRESH_SECRET missing.");
    }

    if (!config.exchange.apiKey) {
      throw new Error("Exchange API Key missing.");
    }

    if (!config.exchange.apiSecret) {
      throw new Error("Exchange API Secret missing.");
    }

    logger.info("Environment validation passed.");
  }

  async validateDatabase() {
    const health = await database.healthCheck();

    if (!health.healthy) {
      throw new Error(
        `Database unavailable: ${health.error}`
      );
    }

    logger.info("Database validation passed.");
  }

  async validateRedis() {
    const health = await redis.healthCheck();

    if (!health.healthy) {
      throw new Error(
        `Redis unavailable: ${health.error}`
      );
    }

    logger.info("Redis validation passed.");
  }

  async validateOwnerSecrets() {
    try {
      await secretManager.listSecrets(
        config.owner.userId
      );

      logger.info("Owner secret validation passed.");
    } catch (err) {
      logger.warn(
        {
          err
        },
        "Owner secrets not yet initialized."
      );
    }
  }

  async validateEmergencyState() {
    const emergency =
      await emergencyStopService.getStatus();

    if (emergency.active) {
      logger.warn(
        {
          reason: emergency.reason
        },
        "System booted with Emergency Stop active."
      );
    }
  }

  async shutdown() {
    logger.info("Security Layer shutdown completed.");
  }
}

module.exports = new SecurityBootstrap();
