"use strict";

const {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions
} = require("./permissions");

function requirePermission(permission) {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required."
      });
    }

    if (!hasPermission(user.role, permission)) {
      return res.status(403).json({
        success: false,
        message: "Permission denied."
      });
    }

    next();
  };
}

function requireAnyPermission(permissions = []) {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required."
      });
    }

    if (!hasAnyPermission(user.role, permissions)) {
      return res.status(403).json({
        success: false,
        message: "Permission denied."
      });
    }

    next();
  };
}

function requireAllPermissions(permissions = []) {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required."
      });
    }

    if (!hasAllPermissions(user.role, permissions)) {
      return res.status(403).json({
        success: false,
        message: "Permission denied."
      });
    }

    next();
  };
}

function requireRole(...roles) {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required."
      });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Role not authorized."
      });
    }

    next();
  };
}

function requireOwner(req, res, next) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required."
    });
  }

  if (user.role !== "OWNER") {
    return res.status(403).json({
      success: false,
      message: "Owner access required."
    });
  }

  next();
}

module.exports = Object.freeze({
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  requireRole,
  requireOwner
});
