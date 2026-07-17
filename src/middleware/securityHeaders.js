"use strict";

const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");

const config = require("../config/environment");

const helmetMiddleware = helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  frameguard: {
    action: "deny"
  },
  referrerPolicy: {
    policy: "no-referrer"
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true
});

const compressionMiddleware = compression({
  level: 6,
  threshold: 1024
});

const corsMiddleware = cors({
  origin(origin, callback) {
    const allowedOrigins =
      (process.env.CORS_ALLOWED_ORIGINS || "")
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);

    if (
      config.app.environment !== "production" &&
      !origin
    ) {
      return callback(null, true);
    }

    if (
      allowedOrigins.length === 0 ||
      allowedOrigins.includes(origin)
    ) {
      return callback(null, true);
    }

    return callback(
      new Error("Origin not allowed by CORS.")
    );
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE"
  ],

  allowedHeaders: [
    "Authorization",
    "Content-Type",
    "Accept",
    "X-Request-Id"
  ],

  exposedHeaders: [
    "X-Request-Id"
  ]
});

module.exports = {
  helmetMiddleware,
  compressionMiddleware,
  corsMiddleware
};
