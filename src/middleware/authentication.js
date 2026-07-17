"use strict";

const jwt = require("jsonwebtoken");

const config = require("../config/environment");
const logger = require("../config/logger");
const AppError = require("../utils/AppError");

function extractToken(req) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw AppError.unauthorized("Authorization header missing.");
  }

  const parts = authorization.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw AppError.unauthorized("Invalid authorization header.");
  }

  return parts[1];
}

function authenticateAccessToken(req, res, next) {
  try {
    const token = extractToken(req);

    const payload = jwt.verify(
      token,
      config.jwt.accessSecret
    );

    req.user = {
      id: payload.sub,
      role: payload.role,
      sessionId: payload.sessionId,
      mfaVerified: payload.mfaVerified === true
    };

    if (req.context) {
      req.context.userId = payload.sub;
    }

    next();
  } catch (err) {
    logger.warn(
      {
        requestId: req.id,
        ip: req.ip,
        reason: err.message
      },
      "Access token validation failed."
    );

    next(AppError.unauthorized("Invalid or expired access token."));
  }
}

function authenticateRefreshToken(token) {
  return jwt.verify(
    token,
    config.jwt.refreshSecret
  );
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        AppError.unauthorized("Authentication required.")
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        AppError.forbidden(
          "Insufficient permissions."
        )
      );
    }

    next();
  };
}

function requireOwner(req, res, next) {
  if (!req.user) {
    return next(
      AppError.unauthorized("Authentication required.")
    );
  }

  if (req.user.id !== config.owner.userId) {
    return next(
      AppError.forbidden(
        "Only the platform owner can access this resource."
      )
    );
  }

  next();
}

module.exports = {
  authenticateAccessToken,
  authenticateRefreshToken,
  requireRole,
  requireOwner
};
