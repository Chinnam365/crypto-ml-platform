"use strict";

class MfaEntity {
  constructor(data = {}) {
    this.id = data.id || null;

    this.userId =
      data.userId || data.user_id || null;

    this.enabled =
      Boolean(data.enabled ?? data.mfa_enabled);

    this.secret =
      data.secret || data.mfa_secret || null;

    this.backupCodes =
      data.backupCodes ||
      data.backup_codes ||
      [];

    this.lastVerifiedAt = data.lastVerifiedAt
      ? new Date(data.lastVerifiedAt)
      : data.last_verified_at
      ? new Date(data.last_verified_at)
      : null;

    this.createdAt = data.createdAt
      ? new Date(data.createdAt)
      : data.created_at
      ? new Date(data.created_at)
      : new Date();

    this.updatedAt = data.updatedAt
      ? new Date(data.updatedAt)
      : data.updated_at
      ? new Date(data.updated_at)
      : new Date();
  }

  enable(secret) {
    this.enabled = true;
    this.secret = secret;
    this.updatedAt = new Date();
  }

  disable() {
    this.enabled = false;
    this.secret = null;
    this.backupCodes = [];
    this.updatedAt = new Date();
  }

  verify() {
    this.lastVerifiedAt = new Date();
  }

  setBackupCodes(codes) {
    this.backupCodes = [...codes];
    this.updatedAt = new Date();
  }

  removeBackupCode(codeHash) {
    this.backupCodes = this.backupCodes.filter(
      (code) => code.hash !== codeHash
    );

    this.updatedAt = new Date();
  }

  hasBackupCodes() {
    return this.backupCodes.length > 0;
  }

  isEnabled() {
    return this.enabled;
  }

  toDatabase() {
    return {
      id: this.id,
      user_id: this.userId,
      mfa_enabled: this.enabled,
      mfa_secret: this.secret,
      backup_codes: JSON.stringify(
        this.backupCodes
      ),
      last_verified_at: this.lastVerifiedAt,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      enabled: this.enabled,
      hasSecret: !!this.secret,
      backupCodesRemaining:
        this.backupCodes.length,
      lastVerifiedAt: this.lastVerifiedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromDatabase(row) {
    return new MfaEntity({
      ...row,
      backup_codes:
        typeof row.backup_codes === "string"
          ? JSON.parse(row.backup_codes)
          : row.backup_codes || []
    });
  }
}

module.exports = MfaEntity;
