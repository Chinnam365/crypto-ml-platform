"use strict";

const DEFAULT_HEADERS = Object.freeze({
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
  "Strict-Transport-Security":
    "max-age=31536000; includeSubDomains; preload",
  "Cache-Control":
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0"
});

function applySecurityHeaders(req, res, next) {
  for (const [header, value] of Object.entries(DEFAULT_HEADERS)) {
    if (!res.getHeader(header)) {
      res.setHeader(header, value);
    }
  }

  next();
}

function setHeader(res, name, value) {
  res.setHeader(name, value);
}

function removeHeader(res, name) {
  res.removeHeader(name);
}

function getDefaultHeaders() {
  return { ...DEFAULT_HEADERS };
}

module.exports = Object.freeze({
  DEFAULT_HEADERS,
  applySecurityHeaders,
  setHeader,
  removeHeader,
  getDefaultHeaders
});
