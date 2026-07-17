"use strict";

const crypto = require("crypto");

const required = [
  "NODE_ENV",
  "PORT",

  "DATABASE_URL",
  "REDIS_URL",

  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",

  "ENCRYPTION_KEY",

  "OWNER_USER_ID",

  "EXCHANGE_NAME",
  "EXCHANGE_API_KEY",
  "EXCHANGE_API_SECRET"
];

function get(name, options = {}) {
  const value = process.env[name];

  if (options.required !== false && (!value || value.trim() === "")) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function toInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function toFloat(value, fallback) {
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function toBool(value, fallback = false) {
  if (value === undefined) return fallback;

  return ["true", "1", "yes", "on"].includes(
    String(value).toLowerCase()
  );
}

required.forEach((v) => get(v));

const encryptionKey = get("ENCRYPTION_KEY");

if (Buffer.from(encryptionKey).length < 32) {
  throw new Error(
    "ENCRYPTION_KEY must be at least 32 bytes."
  );
}

const config = Object.freeze({

  app: Object.freeze({
    name: "AIOS",
    version: "1.0.0",
    environment: get("NODE_ENV"),
    port: toInt(get("PORT"), 3000)
  }),

  owner: Object.freeze({
    userId: get("OWNER_USER_ID")
  }),

  database: Object.freeze({
    url: get("DATABASE_URL"),
    ssl: toBool(process.env.DB_SSL, true),
    poolMin: toInt(process.env.DB_POOL_MIN, 2),
    poolMax: toInt(process.env.DB_POOL_MAX, 20),
    idleTimeout: toInt(process.env.DB_IDLE_TIMEOUT, 30000)
  }),

  redis: Object.freeze({
    url: get("REDIS_URL"),
    ttl: toInt(process.env.REDIS_DEFAULT_TTL, 3600)
  }),

  jwt: Object.freeze({
    accessSecret: get("JWT_ACCESS_SECRET"),
    refreshSecret: get("JWT_REFRESH_SECRET"),
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || "15m",
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || "30d"
  }),

  encryption: Object.freeze({
    algorithm: "aes-256-gcm",
    key: crypto
      .createHash("sha256")
      .update(encryptionKey)
      .digest()
  }),

  exchange: Object.freeze({
    provider: get("EXCHANGE_NAME"),
    apiKey: get("EXCHANGE_API_KEY"),
    apiSecret: get("EXCHANGE_API_SECRET"),
    sandbox: toBool(process.env.EXCHANGE_SANDBOX, false),
    recvWindow: toInt(process.env.EXCHANGE_RECV_WINDOW, 5000),
    requestTimeout: toInt(process.env.EXCHANGE_TIMEOUT, 10000)
  }),

  ai: Object.freeze({
    confidenceThreshold: toFloat(
      process.env.AI_CONFIDENCE_THRESHOLD,
      0.65
    ),
    maxPortfolioRisk: toFloat(
      process.env.AI_MAX_PORTFOLIO_RISK,
      0.02
    ),
    nightlyCompressionHour: toInt(
      process.env.AI_SUMMARY_HOUR,
      2
    ),
    knowledgeRetentionDays: toInt(
      process.env.KNOWLEDGE_RETENTION_DAYS,
      365
    ),
    archiveRetentionDays: toInt(
      process.env.ARCHIVE_RETENTION_DAYS,
      730
    )
  }),

  security: Object.freeze({
    bcryptRounds: toInt(
      process.env.BCRYPT_ROUNDS,
      12
    ),
    sessionTimeoutMinutes: toInt(
      process.env.SESSION_TIMEOUT_MINUTES,
      30
    ),
    rateLimitWindowMs: toInt(
      process.env.RATE_LIMIT_WINDOW_MS,
      60000
    ),
    rateLimitMaxRequests: toInt(
      process.env.RATE_LIMIT_MAX_REQUESTS,
      120
    )
  }),

  logging: Object.freeze({
    level: process.env.LOG_LEVEL || "info",
    pretty: toBool(process.env.LOG_PRETTY, false)
  })

});

module.exports = config;
