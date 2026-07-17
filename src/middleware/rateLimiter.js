"use strict";

const rateLimit = require("express-rate-limit");

const config = require("../config/environment");
const logger = require("../config/logger");

const standardLimiter = rateLimit({
  windowMs: config.security.rateLimitWindowMs,
  max: config.security.rateLimitMaxRequests,

  standardHeaders: true,
  legacyHeaders: false,

  skipSuccessfulRequests: false,

  handler(req, res) {
    logger.warn(
      {
        requestId: req.id,
        ip: req.ip,
        method: req.method,
        url: req.originalUrl
      },
      "Rate limit exceeded."
    );

    res.status(429).json({
      success: false,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests.",
        timestamp: new Date().toISOString()
      }
    });
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 10,

  standardHeaders: true,

  legacyHeaders: false,

  skipSuccessfulRequests: false,

  handler(req, res) {
    logger.warn(
      {
        requestId: req.id,
        ip: req.ip
      },
      "Authentication rate limit exceeded."
    );

    res.status(429).json({
      success: false,
      error: {
        code: "AUTH_RATE_LIMIT_EXCEEDED",
        message:
          "Too many authentication attempts. Please try again later.",
        timestamp: new Date().toISOString()
      }
    });
  }
});

const exchangeLimiter = rateLimit({
  windowMs: 60 * 1000,

  max: 120,

  standardHeaders: true,

  legacyHeaders: false,

  skipSuccessfulRequests: false,

  handler(req, res) {
    logger.warn(
      {
        requestId: req.id,
        ip: req.ip
      },
      "Exchange API rate limit exceeded."
    );

    res.status(429).json({
      success: false,
      error: {
        code: "EXCHANGE_RATE_LIMIT_EXCEEDED",
        message:
          "Exchange request limit exceeded.",
        timestamp: new Date().toISOString()
      }
    });
  }
});

module.exports = {
  standardLimiter,
  authLimiter,
  exchangeLimiter
};
