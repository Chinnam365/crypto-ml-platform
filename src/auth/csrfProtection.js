"use strict";

const crypto = require("crypto");

const HEADER_NAME = "x-csrf-token";
const COOKIE_NAME = "csrf-token";

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

function issueToken(req, res) {
  const token = generateToken();

  req.csrfToken = token;

  if (req.session) {
    req.session.csrfToken = token;
  }

  if (typeof res.cookie === "function") {
    res.cookie(COOKIE_NAME, token, {
      httpOnly: false,
      secure: true,
      sameSite: "strict"
    });
  }

  res.setHeader("X-CSRF-Token", token);

  return token;
}

function validateToken(req) {
  const requestToken =
    req.headers[HEADER_NAME] ||
    req.headers[HEADER_NAME.toLowerCase()] ||
    req.body?.csrfToken ||
    req.query?.csrfToken;

  const storedToken =
    req.session?.csrfToken ||
    req.csrfToken;

  return (
    typeof requestToken === "string" &&
    typeof storedToken === "string" &&
    crypto.timingSafeEqual(
      Buffer.from(requestToken),
      Buffer.from(storedToken)
    )
  );
}

function csrfProtection(req, res, next) {
  if (
    req.method === "GET" ||
    req.method === "HEAD" ||
    req.method === "OPTIONS"
  ) {
    if (!req.session?.csrfToken) {
      issueToken(req, res);
    }

    return next();
  }

  if (!validateToken(req)) {
    return res.status(403).json({
      success: false,
      error: {
        code: "CSRF_VALIDATION_FAILED",
        message: "Invalid CSRF token."
      }
    });
  }

  next();
}

module.exports = Object.freeze({
  HEADER_NAME,
  COOKIE_NAME,
  generateToken,
  issueToken,
  validateToken,
  csrfProtection
});
