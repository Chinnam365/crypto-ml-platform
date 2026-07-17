"use strict";

const contextFactory = require("./contextFactory");

function attachUserContext(req, res, next) {
  try {
    req.context = contextFactory.fromRequest(req);

    res.locals.context = req.context;

    next();
  } catch (error) {
    next(error);
  }
}

function requireAuthenticatedContext(
  req,
  res,
  next
) {
  if (
    !req.context ||
    !req.context.isAuthenticated()
  ) {
    return res.status(401).json({
      success: false,
      message: "Authentication required."
    });
  }

  next();
}

function requireMfaContext(
  req,
  res,
  next
) {
  if (
    !req.context ||
    !req.context.isMfaVerified()
  ) {
    return res.status(403).json({
      success: false,
      message:
        "Multi-factor authentication required."
    });
  }

  next();
}

function requireOwnerContext(
  req,
  res,
  next
) {
  if (
    !req.context ||
    !req.context.isOwner()
  ) {
    return res.status(403).json({
      success: false,
      message: "Owner access required."
    });
  }

  next();
}

function requireAdminContext(
  req,
  res,
  next
) {
  if (
    !req.context ||
    !req.context.isAdmin()
  ) {
    return res.status(403).json({
      success: false,
      message: "Administrator access required."
    });
  }

  next();
}

module.exports = Object.freeze({
  attachUserContext,
  requireAuthenticatedContext,
  requireMfaContext,
  requireOwnerContext,
  requireAdminContext
});
