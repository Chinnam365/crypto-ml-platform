"use strict";

module.exports = Object.freeze({
  // Authentication
  LOGIN_ATTEMPT: "auth.login.attempt",
  LOGIN_SUCCESS: "auth.login.success",
  LOGIN_FAILED: "auth.login.failed",
  LOGOUT: "auth.logout",

  // Session
  SESSION_CREATED: "auth.session.created",
  SESSION_REFRESHED: "auth.session.refreshed",
  SESSION_EXPIRED: "auth.session.expired",
  SESSION_REVOKED: "auth.session.revoked",

  // Tokens
  ACCESS_TOKEN_CREATED: "auth.token.access.created",
  ACCESS_TOKEN_EXPIRED: "auth.token.access.expired",
  REFRESH_TOKEN_CREATED: "auth.token.refresh.created",
  REFRESH_TOKEN_ROTATED: "auth.token.refresh.rotated",
  TOKEN_REVOKED: "auth.token.revoked",

  // MFA
  MFA_SETUP_STARTED: "auth.mfa.setup.started",
  MFA_SETUP_COMPLETED: "auth.mfa.setup.completed",
  MFA_VERIFIED: "auth.mfa.verified",
  MFA_FAILED: "auth.mfa.failed",
  MFA_DISABLED: "auth.mfa.disabled",
  BACKUP_CODE_USED: "auth.mfa.backup.used",

  // Account
  ACCOUNT_LOCKED: "auth.account.locked",
  ACCOUNT_UNLOCKED: "auth.account.unlocked",
  PASSWORD_CHANGED: "auth.password.changed",
  PASSWORD_RESET_REQUESTED: "auth.password.reset.requested",
  PASSWORD_RESET_COMPLETED: "auth.password.reset.completed",

  // Authorization
  AUTHORIZATION_GRANTED: "auth.authorization.granted",
  AUTHORIZATION_DENIED: "auth.authorization.denied",

  // Roles
  ROLE_ASSIGNED: "auth.role.assigned",
  ROLE_CHANGED: "auth.role.changed",
  ROLE_REMOVED: "auth.role.removed",

  // Security
  SUSPICIOUS_ACTIVITY: "auth.security.suspicious",
  EMERGENCY_STOP: "auth.security.emergency_stop",
  API_KEY_ROTATED: "auth.security.api_key_rotated",

  // Audit
  AUDIT_EVENT: "auth.audit.event"
});
