"use strict";

const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const config = require("../config/environment");
const redis = require("../config/redis");
const logger = require("../config/logger");

const ACCESS_PREFIX = "session:access:";
const REFRESH_PREFIX = "session:refresh:";
const REVOKED_PREFIX = "session:revoked:";

function generateSessionId() {
  return crypto.randomUUID();
}

function generateTokenId() {
  return crypto.randomUUID();
}

function buildAccessPayload(user) {
  return {
    sub: user.id,
    role: user.role,
    mfaVerified: user.mfaVerified === true,
    sessionId: user.sessionId,
    jti: generateTokenId()
  };
}

function buildRefreshPayload(user) {
  return {
    sub: user.id,
    sessionId: user.sessionId,
    jti: generateTokenId()
  };
}

async function issueTokens(user) {
  const sessionId = user.sessionId || generateSessionId();

  const payload = {
    ...user,
    sessionId
  };

  const accessPayload = buildAccessPayload(payload);
  const refreshPayload = buildRefreshPayload(payload);

  const accessToken = jwt.sign(
    accessPayload,
    config.jwt.accessSecret,
    {
      expiresIn: config.jwt.accessExpiry
    }
  );

  const refreshToken = jwt.sign(
    refreshPayload,
    config.jwt.refreshSecret,
    {
      expiresIn: config.jwt.refreshExpiry
    }
  );

  await redis.set(
    ACCESS_PREFIX + sessionId,
    accessPayload.jti,
    60 * 60
  );

  await redis.set(
    REFRESH_PREFIX + sessionId,
    refreshPayload.jti,
    60 * 60 * 24 * 30
  );

  logger.info(
    {
      userId: payload.id,
      sessionId
    },
    "Authentication tokens issued."
  );

  return {
    sessionId,
    accessToken,
    refreshToken
  };
}

async function rotateRefreshToken(user, oldSessionId) {
  if (oldSessionId) {
    await revokeSession(oldSessionId);
  }

  return issueTokens(user);
}

async function validateSession(sessionId, tokenId, refresh = false) {
  const key = refresh
    ? REFRESH_PREFIX + sessionId
    : ACCESS_PREFIX + sessionId;

  const stored = await redis.get(key);

  if (!stored) {
    return false;
  }

  return stored === tokenId;
}

async function revokeSession(sessionId) {
  const accessKey = ACCESS_PREFIX + sessionId;
  const refreshKey = REFRESH_PREFIX + sessionId;

  await redis.del(accessKey);
  await redis.del(refreshKey);

  await redis.set(
    REVOKED_PREFIX + sessionId,
    "true",
    60 * 60 * 24 * 30
  );

  logger.info(
    {
      sessionId
    },
    "Session revoked."
  );
}

async function isRevoked(sessionId) {
  return redis.exists(REVOKED_PREFIX + sessionId);
}

module.exports = {
  generateSessionId,
  issueTokens,
  rotateRefreshToken,
  validateSession,
  revokeSession,
  isRevoked
};
