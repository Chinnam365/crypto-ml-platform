"use strict";

class AuthenticationRequestLogger {
  constructor(logger = console) {
    this.logger = logger;
  }

  info(context, message, metadata = {}) {
    this.logger.info({
      level: "info",
      message,
      ...this.buildContext(context),
      ...metadata
    });
  }

  warn(context, message, metadata = {}) {
    this.logger.warn({
      level: "warn",
      message,
      ...this.buildContext(context),
      ...metadata
    });
  }

  error(context, message, error = null, metadata = {}) {
    this.logger.error({
      level: "error",
      message,
      ...this.buildContext(context),
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack
          }
        : undefined,
      ...metadata
    });
  }

  audit(context, action, outcome, metadata = {}) {
    this.logger.info({
      level: "audit",
      action,
      outcome,
      ...this.buildContext(context),
      ...metadata,
      timestamp: new Date().toISOString()
    });
  }

  buildContext(context = {}) {
    return {
      requestId: context.requestId || null,
      correlationId: context.correlationId || null,
      traceId: context.traceId || null,
      userId: context.userId || null,
      sessionId: context.sessionId || null,
      ipAddress: context.ipAddress || null,
      method: context.method || null,
      path: context.path || null
    };
  }
}

module.exports = AuthenticationRequestLogger;
