"use strict";

module.exports = Object.freeze({
  MODULE_NAME: "Authentication",

  MODULE_SHORT_NAME: "auth",

  MODULE_VERSION: "1.0.0",

  API_VERSION: "v1",

  DEFAULT_ROLE: "OWNER",

  GUEST_ROLE: "GUEST",

  TOKEN_TYPES: Object.freeze({
    ACCESS: "ACCESS",
    REFRESH: "REFRESH",
    API_KEY: "API_KEY",
    PASSWORD_RESET: "PASSWORD_RESET",
    EMAIL_VERIFICATION: "EMAIL_VERIFICATION"
  }),

  SESSION_STATUS: Object.freeze({
    ACTIVE: "ACTIVE",
    EXPIRED: "EXPIRED",
    REVOKED: "REVOKED",
    LOCKED: "LOCKED"
  }),

  LOGIN_RESULT: Object.freeze({
    SUCCESS: "SUCCESS",
    FAILED: "FAILED",
    LOCKED: "LOCKED",
    MFA_REQUIRED: "MFA_REQUIRED"
  }),

  MFA_METHODS: Object.freeze({
    TOTP: "TOTP",
    BACKUP_CODE: "BACKUP_CODE"
  }),

  MFA_CODE_LENGTH: 6,

  BACKUP_CODES_COUNT: 10,

  PASSWORD: Object.freeze({
    MIN_LENGTH: 12,
    MAX_LENGTH: 128,
    BCRYPT_ROUNDS: 12
  }),

  JWT: Object.freeze({
    ACCESS_TOKEN_TTL: "15m",
    REFRESH_TOKEN_TTL: "30d",
    ISSUER: "AIOS",
    AUDIENCE: "AIOS-CLIENT"
  }),

  ACCOUNT: Object.freeze({
    MAX_FAILED_LOGINS: 5,
    LOCK_DURATION_MINUTES: 30
  }),

  AUDIT: Object.freeze({
    MAX_EVENTS: 10000
  }),

  CACHE: Object.freeze({
    USER_CONTEXT_TTL_SECONDS: 300,
    PERMISSION_TTL_SECONDS: 600
  })
});
