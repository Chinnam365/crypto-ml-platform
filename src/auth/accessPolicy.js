"use strict";

const { PERMISSIONS } = require("./permissions");

const ACCESS_POLICIES = Object.freeze({
  OWNER: {
    description: "Full unrestricted platform access.",
    permissions: Object.values(PERMISSIONS)
  },

  ADMIN: {
    description:
      "Administrative access without critical system control.",
    permissions: [
      PERMISSIONS.AUTH_LOGIN,
      PERMISSIONS.AUTH_LOGOUT,
      PERMISSIONS.AUTH_REFRESH,
      PERMISSIONS.AUTH_MFA,

      PERMISSIONS.USER_READ,
      PERMISSIONS.USER_UPDATE,

      PERMISSIONS.PROFILE_READ,
      PERMISSIONS.PROFILE_UPDATE,

      PERMISSIONS.EXCHANGE_READ,

      PERMISSIONS.PORTFOLIO_READ,
      PERMISSIONS.PORTFOLIO_UPDATE,

      PERMISSIONS.STRATEGY_READ,
      PERMISSIONS.STRATEGY_UPDATE,

      PERMISSIONS.ML_READ,

      PERMISSIONS.MEMORY_READ,

      PERMISSIONS.RISK_READ,
      PERMISSIONS.RISK_UPDATE,

      PERMISSIONS.AUDIT_READ,

      PERMISSIONS.HEALTH_READ
    ]
  },

  VIEWER: {
    description:
      "Read-only access to platform information.",
    permissions: [
      PERMISSIONS.AUTH_LOGIN,
      PERMISSIONS.AUTH_LOGOUT,
      PERMISSIONS.AUTH_REFRESH,

      PERMISSIONS.PROFILE_READ,

      PERMISSIONS.PORTFOLIO_READ,

      PERMISSIONS.EXCHANGE_READ,

      PERMISSIONS.STRATEGY_READ,

      PERMISSIONS.ML_READ,

      PERMISSIONS.HEALTH_READ
    ]
  }
});

function getPolicy(role = "VIEWER") {
  return (
    ACCESS_POLICIES[role] ||
    ACCESS_POLICIES.VIEWER
  );
}

function getPermissions(role = "VIEWER") {
  return [...getPolicy(role).permissions];
}

function isAllowed(role, permission) {
  return getPolicy(role).permissions.includes(
    permission
  );
}

function listRoles() {
  return Object.keys(ACCESS_POLICIES);
}

module.exports = Object.freeze({
  ACCESS_POLICIES,
  getPolicy,
  getPermissions,
  isAllowed,
  listRoles
});
