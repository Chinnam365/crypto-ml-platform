"use strict";

const {
  AuthenticationError,
  AuthorizationError,
  SessionError,
  TokenError,
  MfaError,
  AccountLockedError,
  ValidationError
} = require("./errors");

class ErrorFactory {
  authentication(message, details) {
    return new AuthenticationError(message, {
      details
    });
  }

  authorization(message, details) {
    return new AuthorizationError(message, {
      details
    });
  }

  session(message, details) {
    return new SessionError(message, {
      details
    });
  }

  token(message, details) {
    return new TokenError(message, {
      details
    });
  }

  mfa(message, details) {
    return new MfaError(message, {
      details
    });
  }

  accountLocked(message, details) {
    return new AccountLockedError(message, {
      details
    });
  }

  validation(message, details) {
    return new ValidationError(message, {
      details
    });
  }

  fromCode(code, message, details) {
    switch (code) {
      case "AUTHENTICATION_ERROR":
        return this.authentication(
          message,
          details
        );

      case "AUTHORIZATION_ERROR":
        return this.authorization(
          message,
          details
        );

      case "SESSION_ERROR":
        return this.session(
          message,
          details
        );

      case "TOKEN_ERROR":
        return this.token(
          message,
          details
        );

      case "MFA_ERROR":
        return this.mfa(
          message,
          details
        );

      case "ACCOUNT_LOCKED":
        return this.accountLocked(
          message,
          details
        );

      case "VALIDATION_ERROR":
        return this.validation(
          message,
          details
        );

      default:
        return new Error(
          message || "Unknown authentication error."
        );
    }
  }
}

module.exports = new ErrorFactory();
