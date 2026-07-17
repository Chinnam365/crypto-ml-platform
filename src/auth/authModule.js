"use strict";

const express = require("express");

const authBootstrap = require("./authBootstrap");
const authRoutes = require("./authRoutes");
const authHealthService = require("./authHealthService");

const {
  requestContext
} = {
  requestContext: require("../middleware/requestContext")
};

const {
  helmetMiddleware,
  compressionMiddleware,
  corsMiddleware
} = require("../middleware/securityHeaders");

const {
  standardLimiter
} = require("../middleware/rateLimiter");

const {
  errorHandler,
  notFoundHandler
} = require("../middleware/errorHandler");

class AuthenticationModule {
  constructor() {
    this.router = express.Router();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) {
      return this.router;
    }

    await authBootstrap.initialize();

    this.router.use(requestContext);

    this.router.use(corsMiddleware);

    this.router.use(helmetMiddleware);

    this.router.use(compressionMiddleware);

    this.router.use(standardLimiter);

    this.router.get(
      "/health",
      async (req, res, next) => {
        try {
          const report =
            await authHealthService.getHealthReport();

          res.json({
            success: true,
            health: report
          });
        } catch (err) {
          next(err);
        }
      }
    );

    this.router.use("/", authRoutes);

    this.router.use(notFoundHandler);

    this.router.use(errorHandler);

    this.initialized = true;

    return this.router;
  }

  async shutdown() {
    await authBootstrap.shutdown();
  }
}

module.exports = new AuthenticationModule();
