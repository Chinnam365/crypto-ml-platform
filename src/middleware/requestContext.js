"use strict";

const crypto = require("crypto");

const logger = require("../config/logger");

function requestContext(req, res, next) {
  const requestId =
    req.headers["x-request-id"] || crypto.randomUUID();

  const startTime = process.hrtime.bigint();

  req.id = requestId;

  req.context = {
    requestId,
    userId: null,
    startedAt: new Date(),
    metadata: {}
  };

  res.setHeader("X-Request-Id", requestId);

  res.on("finish", () => {
    const durationNs = process.hrtime.bigint() - startTime;
    const durationMs = Number(durationNs) / 1_000_000;

    logger.info(
      {
        requestId,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        durationMs: Number(durationMs.toFixed(2))
      },
      "HTTP Request"
    );
  });

  next();
}

module.exports = requestContext;
