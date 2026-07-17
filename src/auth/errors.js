"use strict";

class AuthenticationError extends Error {
  constructor(message = "Authentication failed.", options = {}) {
    super(message);

    this.name = "AuthenticationError";
    this.code = options.code || "AUTHENTICATION_ERROR";
    this.status = options.status || 401;
    this.details = options.details || null;
  }
}

class AuthorizationError extends Error {
  constructor(message = "Permission denied.", options = {}) {
    super(message);

    this.name = "AuthorizationError";
    this.code = options.code || "AUTHORIZATION_ERROR";
    this.status = options.status || 403;
    this.details = options.details || null;
  }
}

class SessionError extends Error {
  constructor(message = "Invalid session.", options = {}) {
    super(message);

    this.name = "SessionError";
    this.code = options.code || "SESSION_ERROR";
    this.status = options.status || 401;
    this.details = options.details || null;
  }
}

class TokenError extends Error {
  constructor(message = "Invalid token.", options = {}) {
    super(message);

    this.name = "TokenError";
    this.code = options.code || "TOKEN_ERROR";
    this.status = options.status || 401;
    this.details = options.details || null;
  }
}

class MfaError extends Error {
  constructor(message = "Multi-factor authentication failed.", options = {}) {
    super(message);

    this.name = "MfaError";
    this.code = options.code || "MFA_ERROR";
    this.status = options.status || 401;
    this.details = options.details || null;
  }
}

class AccountLockedError extends Error {
  constructor(message = "Account is locked.", options = {}) {
    super(message);

    this.name = "AccountLockedError";
    this.code = options.code || "ACCOUNT_LOCKED";
    this.status = options.status || 423;
    this.details = options.details || null;
  }
}

class ValidationError extends Error {
  constructor(message = "Validation failed.", options = {}) {
    super(message);

    this.name = "ValidationError";
    this.code = options.code || "VALIDATION_ERROR";
    this.status = options.status || 400;
    this.details = options.details || null;
  }
}

module.exports = Object.freeze({
  AuthenticationError,
  AuthorizationError,
  SessionError,
  TokenError,
  MfaError,
  AccountLockedError,
  ValidationError
});
