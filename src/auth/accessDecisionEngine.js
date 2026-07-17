"use strict";

const {
  can,
  canAny,
  canAll,
  getUserPermissions
} = require("./accessControl");

class AccessDecisionEngine {
  constructor() {
    this.cache = new Map();
  }

  evaluate(user, permission) {
    const allowed = can(user, permission);

    return {
      allowed,
      permission,
      role: user?.role || null,
      reason: allowed
        ? "Permission granted."
        : "Permission denied.",
      timestamp: new Date().toISOString()
    };
  }

  evaluateAny(user, permissions = []) {
    const allowed = canAny(user, permissions);

    return {
      allowed,
      permissions,
      role: user?.role || null,
      reason: allowed
        ? "At least one permission granted."
        : "None of the required permissions are available.",
      timestamp: new Date().toISOString()
    };
  }

  evaluateAll(user, permissions = []) {
    const allowed = canAll(user, permissions);

    return {
      allowed,
      permissions,
      role: user?.role || null,
      reason: allowed
        ? "All required permissions granted."
        : "One or more required permissions are missing.",
      timestamp: new Date().toISOString()
    };
  }

  getPermissionSnapshot(user) {
    return {
      role: user?.role || null,
      permissions: getUserPermissions(user),
      generatedAt: new Date().toISOString()
    };
  }

  cacheDecision(key, decision) {
    this.cache.set(key, {
      ...decision,
      cachedAt: Date.now()
    });
  }

  getCachedDecision(key) {
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    return cached;
  }

  clearCache() {
    this.cache.clear();
  }

  cacheSize() {
    return this.cache.size;
  }
}

module.exports = new AccessDecisionEngine();
