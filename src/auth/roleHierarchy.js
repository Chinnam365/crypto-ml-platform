"use strict";

const ROLE_HIERARCHY = Object.freeze({
  OWNER: 100,
  ADMIN: 75,
  OPERATOR: 60,
  ANALYST: 40,
  VIEWER: 20,
  GUEST: 0
});

function getLevel(role = "GUEST") {
  return ROLE_HIERARCHY[role] ?? 0;
}

function roleExists(role) {
  return Object.prototype.hasOwnProperty.call(
    ROLE_HIERARCHY,
    role
  );
}

function hasRole(userRole, requiredRole) {
  return (
    getLevel(userRole) >=
    getLevel(requiredRole)
  );
}

function canManage(actorRole, targetRole) {
  return (
    getLevel(actorRole) >
    getLevel(targetRole)
  );
}

function highestRole(roles = []) {
  if (!Array.isArray(roles) || roles.length === 0) {
    return null;
  }

  return roles.reduce((highest, current) =>
    getLevel(current) > getLevel(highest)
      ? current
      : highest
  );
}

function lowestRole(roles = []) {
  if (!Array.isArray(roles) || roles.length === 0) {
    return null;
  }

  return roles.reduce((lowest, current) =>
    getLevel(current) < getLevel(lowest)
      ? current
      : lowest
  );
}

function listRoles() {
  return Object.keys(ROLE_HIERARCHY)
    .sort(
      (a, b) =>
        ROLE_HIERARCHY[b] -
        ROLE_HIERARCHY[a]
    );
}

module.exports = Object.freeze({
  ROLE_HIERARCHY,
  getLevel,
  roleExists,
  hasRole,
  canManage,
  highestRole,
  lowestRole,
  listRoles
});
