"use strict";

const DEFAULT_METHODS = Object.freeze([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS"
]);

const DEFAULT_HEADERS = Object.freeze([
  "Authorization",
  "Content-Type",
  "Accept",
  "Origin",
  "X-Requested-With",
  "X-Correlation-Id",
  "X-Trace-Id"
]);

const DEFAULT_EXPOSED_HEADERS = Object.freeze([
  "X-Correlation-Id",
  "X-Trace-Id"
]);

function createCorsMiddleware(options = {}) {
  const {
    origin = "*",
    methods = DEFAULT_METHODS,
    allowedHeaders = DEFAULT_HEADERS,
    exposedHeaders = DEFAULT_EXPOSED_HEADERS,
    credentials = false,
    maxAge = 86400
  } = options;

  return function corsPolicy(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader(
      "Access-Control-Allow-Methods",
      methods.join(", ")
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      allowedHeaders.join(", ")
    );
    res.setHeader(
      "Access-Control-Expose-Headers",
      exposedHeaders.join(", ")
    );
    res.setHeader(
      "Access-Control-Allow-Credentials",
      String(credentials)
    );
    res.setHeader(
      "Access-Control-Max-Age",
      String(maxAge)
    );

    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

    next();
  };
}

module.exports = Object.freeze({
  DEFAULT_METHODS,
  DEFAULT_HEADERS,
  DEFAULT_EXPOSED_HEADERS,
  createCorsMiddleware
});
