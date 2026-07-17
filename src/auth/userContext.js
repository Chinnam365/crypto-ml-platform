"use strict";

class UserContext {
  constructor(user = {}, session = {}) {
    this.userId = user.id || null;
    this.email = user.email || null;
    this.role = user.role || "GUEST";

    this.sessionId =
      session.sessionId ||
      session.session_id ||
      null;

    this.mfaVerified = Boolean(
      session.mfaVerified ??
      session.mfa_verified
    );

    this.permissions = Array.isArray(
      user.permissions
    )
      ? [...user.permissions]
      : [];

    this.ipAddress =
      session.ipAddress ||
      session.ip_address ||
      null;

    this.userAgent =
      session.userAgent ||
      session.user_agent ||
      null;

    this.createdAt = new Date();
  }

  hasPermission(permission) {
    return this.permissions.includes(permission);
  }

  hasAnyPermission(permissions = []) {
    return permissions.some(permission =>
      this.permissions.includes(permission)
    );
  }

  hasAllPermissions(permissions = []) {
    return permissions.every(permission =>
      this.permissions.includes(permission)
    );
  }

  isAuthenticated() {
    return this.userId !== null;
  }

  isOwner() {
    return this.role === "OWNER";
  }

  isAdmin() {
    return (
      this.role === "OWNER" ||
      this.role === "ADMIN"
    );
  }

  isMfaVerified() {
    return this.mfaVerified;
  }

  addPermission(permission) {
    if (!this.permissions.includes(permission)) {
      this.permissions.push(permission);
    }
  }

  removePermission(permission) {
    this.permissions = this.permissions.filter(
      p => p !== permission
    );
  }

  clearPermissions() {
    this.permissions = [];
  }

  toJSON() {
    return {
      userId: this.userId,
      email: this.email,
      role: this.role,
      sessionId: this.sessionId,
      mfaVerified: this.mfaVerified,
      permissions: [...this.permissions],
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      createdAt: this.createdAt
    };
  }
}

module.exports = UserContext;
