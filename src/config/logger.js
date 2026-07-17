"use strict";

const pino = require("pino");
const config = require("./environment");

const logger = pino({
  level: config.logging.level,
  transport: config.logging.pretty
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname"
        }
      }
    : undefined,
  base: {
    service: config.app.name,
    version: config.app.version,
    environment: config.app.environment
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  serializers: {
    err: pino.stdSerializers.err
  },
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "password",
      "accessToken",
      "refreshToken",
      "apiKey",
      "apiSecret",
      "exchange.apiKey",
      "exchange.apiSecret"
    ],
    censor: "[REDACTED]"
  }
});

module.exports = logger;
