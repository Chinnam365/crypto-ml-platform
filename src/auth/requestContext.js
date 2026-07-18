"use strict";

const crypto = require("crypto");

class AuthenticationRequestContext {
  constructor(req = {}) {
    this.requestId =
      req.requestId ||
      crypto.randomUUID();

    this.correlationId =
      req.headers?.["x-correlation-id"] ||
      this.requestId;

    this.traceId =
      req.headers?.["x-trace-id"] ||
      crypto.randomUUID();

    this.userId =
      req.user?.id ||
      req.context?.userId ||
      null;

    this.sessionId =
      req.session?.sessionId ||
      req.context?.sessionId ||
      null;

    this.ipAddress =
      req.ip ||
      req.headers?.["x-forwarded-for"] ||
      null;

    this.userAgent =
      req.get?.("user-agent") ||
      req.headers?.["user-agent"] ||
      null;

    this.method =
      req.method || null;

    this.path =
      req.originalUrl ||
      req.url ||
      null;

    this.startedAt = Date.now();
  }

  duration() {
    return Date.now() - this.startedAt;
  }

  complete(statusCode) {
    return {
      requestId: this.requestId,
      correlationId: this.correlationId,
      traceId: this.traceId,
      userId: this.userId,
      sessionId: this.sessionId,
      method: this.method,
      path: this.path,
      statusCode,
      durationMs: this.duration(),
      completedAt: new Date().toISOString()
    };
  }

  toJSON() {
    return {
      requestId: this.requestId,
      correlationId: this.correlationId,
      traceId: this.traceId,
      userId: this.userId,
      sessionId: this.sessionId,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      method: this.method,
      path: this.path,
      startedAt: this.startedAt
    };
  }
}

module.exports = AuthenticationRequestContext;
