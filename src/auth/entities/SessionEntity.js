"use strict";

class SessionEntity {
  constructor(data = {}) {
    this.sessionId = data.sessionId || data.session_id || null;

    this.userId = data.userId || data.user_id || null;

    this.role = data.role || "OWNER";

    this.ipAddress =
      data.ipAddress || data.ip_address || null;

    this.userAgent =
      data.userAgent || data.user_agent || null;

    this.mfaVerified =
      Boolean(data.mfaVerified ?? data.mfa_verified);

    this.status = data.status || "ACTIVE";

    this.createdAt = data.createdAt
      ? new Date(data.createdAt)
      : data.created_at
      ? new Date(data.created_at)
      : new Date();

    this.lastActivity = data.lastActivity
      ? new Date(data.lastActivity)
      : data.last_activity
      ? new Date(data.last_activity)
      : new Date();

    this.expiresAt = data.expiresAt
      ? new Date(data.expiresAt)
      : data.expires_at
      ? new Date(data.expires_at)
      : null;
  }

  touch() {
    this.lastActivity = new Date();
  }

  revoke() {
    this.status = "REVOKED";
  }

  expire() {
    this.status = "EXPIRED";
  }

  activate() {
    this.status = "ACTIVE";
  }

  isActive() {
    if (this.status !== "ACTIVE") {
      return false;
    }

    if (!this.expiresAt) {
      return true;
    }

    return this.expiresAt.getTime() > Date.now();
  }

  isExpired() {
    if (this.status === "EXPIRED") {
      return true;
    }

    if (!this.expiresAt) {
      return false;
    }

    return this.expiresAt.getTime() <= Date.now();
  }

  isOwner() {
    return this.role === "OWNER";
  }

  requiresMfa() {
    return this.mfaVerified;
  }

  toDatabase() {
    return {
      session_id: this.sessionId,
      user_id: this.userId,
      role: this.role,
      ip_address: this.ipAddress,
      user_agent: this.userAgent,
      mfa_verified: this.mfaVerified,
      status: this.status,
      created_at: this.createdAt,
      last_activity: this.lastActivity,
      expires_at: this.expiresAt
    };
  }

  toJSON() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      role: this.role,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      mfaVerified: this.mfaVerified,
      status: this.status,
      createdAt: this.createdAt,
      lastActivity: this.lastActivity,
      expiresAt: this.expiresAt,
      active: this.isActive()
    };
  }

  static fromDatabase(row) {
    return new SessionEntity(row);
  }
}

module.exports = SessionEntity;
