"use strict";

const PERMISSIONS = Object.freeze({
  SYSTEM_ADMIN: "system:admin",

  AUTH_LOGIN: "auth:login",
  AUTH_LOGOUT: "auth:logout",
  AUTH_REFRESH: "auth:refresh",
  AUTH_MFA: "auth:mfa",

  USER_READ: "user:read",
  USER_CREATE: "user:create",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",

  PROFILE_READ: "profile:read",
  PROFILE_UPDATE: "profile:update",

  API_KEYS_READ: "apikeys:read",
  API_KEYS_CREATE: "apikeys:create",
  API_KEYS_UPDATE: "apikeys:update",
  API_KEYS_DELETE: "apikeys:delete",

  EXCHANGE_READ: "exchange:read",
  EXCHANGE_CONNECT: "exchange:connect",
  EXCHANGE_TRADE: "exchange:trade",

  PORTFOLIO_READ: "portfolio:read",
  PORTFOLIO_UPDATE: "portfolio:update",
  PORTFOLIO_REBALANCE: "portfolio:rebalance",

  STRATEGY_READ: "strategy:read",
  STRATEGY_CREATE: "strategy:create",
  STRATEGY_UPDATE: "strategy:update",
  STRATEGY_DELETE: "strategy:delete",

  ML_READ: "ml:read",
  ML_TRAIN: "ml:train",
  ML_DEPLOY: "ml:deploy",

  MEMORY_READ: "memory:read",
  MEMORY_WRITE: "memory:write",

  RISK_READ: "risk:read",
  RISK_UPDATE: "risk:update",

  AUDIT_READ: "audit:read",

  SETTINGS_READ: "settings:read",
  SETTINGS_UPDATE: "settings:update",

  EMERGENCY_STOP: "system:emergency_stop",

  HEALTH_READ: "system:health",

  BACKUP_CREATE: "system:backup",
  BACKUP_RESTORE: "system:restore"
});

const ROLE_PERMISSIONS = Object.freeze({
  OWNER: Object.values(PERMISSIONS),

  ADMIN: [
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

    PERMISSIONS.STRATEGY_READ,

    PERMISSIONS.ML_READ,

    PERMISSIONS.MEMORY_READ,

    PERMISSIONS.RISK_READ,

    PERMISSIONS.AUDIT_READ,

    PERMISSIONS.HEALTH_READ
  ],

  VIEWER: [
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
});

function getPermissions(role = "VIEWER") {
  return ROLE_PERMISSIONS[role] || [];
}

function hasPermission(role, permission) {
  return getPermissions(role).includes(permission);
}

function hasAnyPermission(role, permissions = []) {
  return permissions.some((permission) =>
    hasPermission(role, permission)
  );
}

function hasAllPermissions(role, permissions = []) {
  return permissions.every((permission) =>
    hasPermission(role, permission)
  );
}

module.exports = Object.freeze({
  PERMISSIONS,
  ROLE_PERMISSIONS,
  getPermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions
});
