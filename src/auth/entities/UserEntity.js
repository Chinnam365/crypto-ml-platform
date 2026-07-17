"use strict";

class UserEntity {
  constructor(data = {}) {
    this.id = data.id || null;
    this.email = data.email || null;
    this.passwordHash = data.password_hash || null;
    this.role = data.role || "OWNER";

    this.mfaEnabled = Boolean(data.mfa_enabled);
    this.mfaSecret = data.mfa_secret || null;

    this.failedLoginAttempts =
      Number(data.failed_login_attempts || 0);

    this.lockedUntil = data.locked_until
      ? new Date(data.locked_until)
      : null;

    this.lastLoginAt = data.last_login_at
      ? new Date(data.last_login_at)
      : null;

    this.createdAt = data.created_at
      ? new Date(data.created_at)
      : null;

    this.updatedAt = data.updated_at
      ? new Date(data.updated_at)
      : null;
  }

  isLocked() {
    if (!this.lockedUntil) {
      return false;
    }

    return this.lockedUntil.getTime() > Date.now();
  }

  isOwner() {
    return this.role === "OWNER";
  }

  requiresMfa() {
    return this.mfaEnabled;
  }

  recordFailedLogin() {
    this.failedLoginAttempts += 1;
  }

  resetFailedLogins() {
    this.failedLoginAttempts = 0;
  }

  updateLastLogin() {
    this.lastLoginAt = new Date();
    this.failedLoginAttempts = 0;
    this.lockedUntil = null;
  }

  lock(minutes = 30) {
    this.lockedUntil = new Date(
      Date.now() + minutes * 60 * 1000
    );
  }

  toDatabase() {
    return {
      id: this.id,
      email: this.email,
      password_hash: this.passwordHash,
      role: this.role,
      mfa_enabled: this.mfaEnabled,
      mfa_secret: this.mfaSecret,
      failed_login_attempts: this.failedLoginAttempts,
      locked_until: this.lockedUntil,
      last_login_at: this.lastLoginAt,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      role: this.role,
      mfaEnabled: this.mfaEnabled,
      failedLoginAttempts: this.failedLoginAttempts,
      locked: this.isLocked(),
      lastLoginAt: this.lastLoginAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromDatabase(row) {
    return new UserEntity(row);
  }
}

module.exports = UserEntity;
