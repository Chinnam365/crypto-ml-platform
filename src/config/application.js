"use strict";

const http = require("http");
const https = require("https");

const config = require("./environment");
const logger = require("./logger");
const database = require("./database");
const redis = require("./redis");

class Application {
  constructor() {
    this.initialized = false;
    this.shutdownInProgress = false;
  }

  async initialize() {
    if (this.initialized) {
      return;
    }

    logger.info("========================================");
    logger.info(`${config.app.name} v${config.app.version}`);
    logger.info(`Environment : ${config.app.environment}`);
    logger.info("Initializing platform...");
    logger.info("========================================");

    http.globalAgent.keepAlive = true;
    https.globalAgent.keepAlive = true;

    await database.healthCheck();

    await redis.createRedisClient();

    this.registerProcessEvents();

    this.initialized = true;

    logger.info("Platform initialization completed.");
  }

  registerProcessEvents() {
    process.on("SIGINT", async () => {
      await this.shutdown("SIGINT");
    });

    process.on("SIGTERM", async () => {
      await this.shutdown("SIGTERM");
    });

    process.on("uncaughtException", async (err) => {
      logger.fatal(
        {
          err
        },
        "Uncaught Exception"
      );

      await this.shutdown("uncaughtException", 1);
    });

    process.on("unhandledRejection", async (reason) => {
      logger.fatal(
        {
          reason
        },
        "Unhandled Promise Rejection"
      );

      await this.shutdown("unhandledRejection", 1);
    });
  }

  async shutdown(reason = "Unknown", exitCode = 0) {
    if (this.shutdownInProgress) {
      return;
    }

    this.shutdownInProgress = true;

    logger.warn({
      reason
    }, "Platform shutdown initiated.");

    try {
      await redis.disconnect();
    } catch (err) {
      logger.error({
        err
      }, "Redis shutdown failed.");
    }

    try {
      await database.shutdown();
    } catch (err) {
      logger.error({
        err
      }, "Database shutdown failed.");
    }

    logger.info("Shutdown completed.");

    process.exit(exitCode);
  }
}

module.exports = new Application();
