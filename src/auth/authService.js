"use strict";

const authRepository = require("./authRepository");
const authConstants = require("./authConstants");

const security = require("../security");

const AppError = require("../utils/AppError");

const MAX_FAILED_ATTEMPTS = 5;
const ACCOUNT_LOCK_MINUTES = 30;

async function login({
  email,
  password,
  mfaToken = null,
  ipAddress = null,
  userAgent = null,
  requestId = null
}) {
  const user = await authRepository.findByEmail(email);

  if (!user) {
    throw AppError.unauthorized("Invalid credentials.");
  }

  if (
    user.locked_until &&
    new Date(user.locked_until) > new Date()
  ) {
    throw AppError.forbidden(
      "Account temporarily locked."
    );
  }

  const passwordValid =
    await security.password.verifyPassword(
      password,
      user.password_hash
    );

  if (!passwordValid) {
    await authRepository.incrementFailedLogin(user.id);

    const failedAttempts =
      (user.failed_login_attempts || 0) + 1;

    if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
      await authRepository.lockAccount(
        user.id,
        ACCOUNT_LOCK_MINUTES
      );
    }

    await security.audit.loginFailure({
      userId: user.id,
      ipAddress,
      userAgent,
      requestId
    });

    throw AppError.unauthorized(
      "Invalid credentials."
    );
  }

  if (user.mfa_enabled) {
    if (!mfaToken) {
      return {
        success: false,
        result:
          authConstants.LOGIN_RESULT.MFA_REQUIRED
      };
    }

    const verified =
      security.totp.verifyToken(
        user.mfa_secret,
        mfaToken
      );

    if (!verified) {
      await security.audit.mfaFailure({
        userId: user.id,
        ipAddress,
        userAgent,
        requestId
      });

      throw AppError.unauthorized(
        "Invalid MFA code."
      );
    }
  }

  await authRepository.updateLastLogin(user.id);

  const session =
    await security.sessions.createSession({
      userId: user.id,
      role: user.role,
      ipAddress,
      userAgent,
      mfaVerified: user.mfa_enabled
    });

  const tokens =
    await security.tokens.issueTokens({
      id: user.id,
      role: user.role,
      sessionId: session.sessionId,
      mfaVerified: user.mfa_enabled
    });

  await security.audit.loginSuccess({
    userId: user.id,
    sessionId: session.sessionId,
    ipAddress,
    userAgent,
    requestId
  });

  return {
    success: true,
    result:
      authConstants.LOGIN_RESULT.SUCCESS,
    session,
    tokens,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      mfaEnabled: user.mfa_enabled
    }
  };
}

async function logout(sessionId, context = {}) {
  await security.sessions.destroySession(
    sessionId
  );

  await security.tokens.revokeSession(
    sessionId
  );

  await security.audit.logout({
    sessionId,
    ...context
  });

  return {
    success: true
  };
}

async function refresh(refreshToken) {
  const payload =
    security.tokens.authenticateRefreshToken(
      refreshToken
    );

  const valid =
    await security.tokens.validateSession(
      payload.sessionId,
      payload.jti,
      true
    );

  if (!valid) {
    throw AppError.unauthorized(
      "Refresh token revoked."
    );
  }

  const user =
    await authRepository.findById(payload.sub);

  if (!user) {
    throw AppError.notFound(
      "User not found."
    );
  }

  return security.tokens.rotateRefreshToken(
    {
      id: user.id,
      role: user.role,
      mfaVerified: user.mfa_enabled
    },
    payload.sessionId
  );
}

module.exports = {
  login,
  logout,
  refresh
};
