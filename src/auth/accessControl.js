"use strict";

const {
  PERMISSIONS,
  getPermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions
} = require("./permissions");

function getUserPermissions(user) {
  if (!user) {
    return [];
  }

  return getPermissions(user.role);
}

function can(user, permission) {
  if (!user) {
    return false;
  }

  return hasPermission(user.role, permission);
}

function canAny(user, permissions = []) {
  if (!user) {
    return false;
  }

  return hasAnyPermission(user.role, permissions);
}

function canAll(user, permissions = []) {
  if (!user) {
    return false;
  }

  return hasAllPermissions(user.role, permissions);
}

function assertPermission(user, permission) {
  if (!can(user, permission)) {
    const error = new Error(
      `Missing permission: ${permission}`
    );

    error.status = 403;
    error.code = "PERMISSION_DENIED";

    throw error;
  }

  return true;
}

function assertAnyPermission(user, permissions = []) {
  if (!canAny(user, permissions)) {
    const error = new Error(
      "Missing one of the required permissions."
    );

    error.status = 403;
    error.code = "PERMISSION_DENIED";

    throw error;
  }

  return true;
}

function assertAllPermissions(user, permissions = []) {
  if (!canAll(user, permissions)) {
    const error = new Error(
      "Missing required permissions."
    );

    error.status = 403;
    error.code = "PERMISSION_DENIED";

    throw error;
  }

  return true;
}

module.exports = Object.freeze({
  PERMISSIONS,

  getUserPermissions,

  can,
  canAny,
  canAll,

  assertPermission,
  assertAnyPermission,
  assertAllPermissions
});
