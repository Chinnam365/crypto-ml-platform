"use strict";

const {
  authenticateAccessToken,
  requireRole,
  requireOwner
} = require("../middleware/authentication");

const security = require("../security");
const AppError = require("../utils/AppError");

async function requireAuthenticated(req, res, next) {
  authenticateAccessToken(req, res, async (err) => {
    if (err) {
      return next(err);
    }

    try {
      const exists =
        await security.sessions.sessionExists(
          req.user.sessionId
        );

      if (!exists) {
        return next(
          AppError.unauthorized(
            "Session has expired."
          )
        );
      }

      await security.sessions.refreshSession(
        req.user.sessionId
      );

      next();
    } catch (error) {
      next(error);
    }
  });
}

function requireMfa(req, res, next) {
  if (!req.user) {
    return next(
      AppError.unauthorized(
        "Authentication required."
      )
    );
  }

  if (!req.user.mfaVerified) {
    return next(
      AppError.forbidden(
        "Multi-factor authentication required."
      )
    );
  }

  next();
}

function requireEmergencyClearance() {
  return async (req, res, next) => {
    try {
      await security.emergency.assertTradingAllowed();

      next();
    } catch (err) {
      next(
        AppError.serviceUnavailable(
          err.message
        )
      );
    }
  };
}

function requireOwnerMfa(req, res, next) {
  requireOwner(req, res, (err) => {
    if (err) {
      return next(err);
    }

    requireMfa(req, res, next);
  });
}

module.exports = {
  requireAuthenticated,
  requireRole,
  requireOwner,
  requireMfa,
  requireOwnerMfa,
  requireEmergencyClearance
};
