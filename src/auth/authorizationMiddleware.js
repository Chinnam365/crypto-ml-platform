"use strict";

const accessControl = require("./accessControl");
const authorizationAudit = require("./authorizationAudit");

function requirePermission(permission) {
  return (req, res, next) => {
    const context = req.context || req.user;

    if (!context) {
      return res.status(401).json({
        success: false,
        message: "Authentication required."
      });
    }

    const allowed = accessControl.can(
      context,
      permission
    );

    authorizationAudit.record({
      userId: context.userId || context.id,
      role: context.role,
      permission,
      resource: req.originalUrl,
      action: req.method,
      granted: allowed,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      reason: allowed
        ? "Permission granted."
        : "Permission denied."
    });

    if (!allowed) {
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
    const context = req.context || req.user;

    if (!context) {
      return res.status(401).json({
        success: false,
        message: "Authentication required."
      });
    }

    const allowed = accessControl.canAny(
      context,
      permissions
    );

    authorizationAudit.record({
      userId: context.userId || context.id,
      role: context.role,
      permission: permissions.join(", "),
      resource: req.originalUrl,
      action: req.method,
      granted: allowed,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      reason: allowed
        ? "One required permission matched."
        : "No matching permissions."
    });

    if (!allowed) {
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
    const context = req.context || req.user;

    if (!context) {
      return res.status(401).json({
        success: false,
        message: "Authentication required."
      });
    }

    const allowed = accessControl.canAll(
      context,
      permissions
    );

    authorizationAudit.record({
      userId: context.userId || context.id,
      role: context.role,
      permission: permissions.join(", "),
      resource: req.originalUrl,
      action: req.method,
      granted: allowed,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      reason: allowed
        ? "All permissions granted."
        : "Missing one or more permissions."
    });

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "Permission denied."
      });
    }

    next();
  };
}

module.exports = Object.freeze({
  requirePermission,
  requireAnyPermission,
  requireAllPermissions
});
