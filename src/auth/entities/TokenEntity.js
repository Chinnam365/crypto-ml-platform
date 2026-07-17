"use strict";

class TokenEntity {
  constructor(data = {}) {
    this.id = data.id || null;

    this.userId = data.userId || data.user_id || null;

    this.sessionId =
      data.sessionId || data.session_id || null;

    this.tokenId =
      data.tokenId || data.token_id || null;

    this.type = data.type || "ACCESS";

    this.status = data.status || "ACTIVE";

    this.issuedAt = data.issuedAt
      ? new Date(data.issuedAt)
      : data.issued_at
      ? new Date(data.issued_at)
      : new Date();

    this.expiresAt = data.expiresAt
      ? new Date(data.expiresAt)
      : data.expires_at
      ? new Date(data.expires_at)
      : null;

    this.revokedAt = data.revokedAt
      ? new Date(data.revokedAt)
      : data.revoked_at
      ? new Date(data.revoked_at)
      : null;

    this.ipAddress =
      data.ipAddress || data.ip_address || null;

    this.userAgent =
      data.userAgent || data.user_agent || null;
  }

  revoke() {
    this.status = "REVOKED";
    this.revokedAt = new Date();
  }

  expire() {
    this.status = "EXPIRED";
  }

  activate() {
    this.status = "ACTIVE";
    this.revokedAt = null;
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

    return Date.now() >= this.expiresAt.getTime();
  }

  isRevoked() {
    return this.status === "REVOKED";
  }

  getRemainingLifetimeSeconds() {
    if (!this.expiresAt) {
      return null;
    }

    return Math.max(
      0,
      Math.floor(
        (this.expiresAt.getTime() - Date.now()) / 1000
      )
    );
  }

  toDatabase() {
    return {
      id: this.id,
      user_id: this.userId,
      session_id: this.sessionId,
      token_id: this.tokenId,
      type: this.type,
      status: this.status,
      issued_at: this.issuedAt,
      expires_at: this.expiresAt,
      revoked_at: this.revokedAt,
      ip_address: this.ipAddress,
      user_agent: this.userAgent
    };
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      sessionId: this.sessionId,
      tokenId: this.tokenId,
      type: this.type,
      status: this.status,
      issuedAt: this.issuedAt,
      expiresAt: this.expiresAt,
      revokedAt: this.revokedAt,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      active: this.isActive(),
      expired: this.isExpired(),
      remainingLifetime:
        this.getRemainingLifetimeSeconds()
    };
  }

  static fromDatabase(row) {
    return new TokenEntity(row);
  }
}

module.exports = TokenEntity;
