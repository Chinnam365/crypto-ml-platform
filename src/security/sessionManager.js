"use strict";

const crypto = require("crypto");

const redis = require("../config/redis");
const config = require("../config/environment");
const logger = require("../config/logger");

const SESSION_PREFIX = "session:";
const USER_PREFIX = "user:sessions:";
const DEFAULT_TTL = config.security.sessionTimeoutMinutes * 60;

function buildSessionKey(sessionId) {
  return `${SESSION_PREFIX}${sessionId}`;
}

function buildUserKey(userId) {
  return `${USER_PREFIX}${userId}`;
}

async function createSession({
  userId,
  role,
  ipAddress,
  userAgent,
  mfaVerified = false
}) {
  const sessionId = crypto.randomUUID();

  const session = {
    sessionId,
    userId,
    role,
    ipAddress,
    userAgent,
    mfaVerified,
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString()
  };

  await redis.set(
    buildSessionKey(sessionId),
    JSON.stringify(session),
    DEFAULT_TTL
  );

  await redis.hashSet(
    buildUserKey(userId),
    sessionId,
    new Date().toISOString()
  );

  logger.info(
    {
      userId,
      sessionId
    },
    "Session created."
  );

  return session;
}

async function getSession(sessionId) {
  const session = await redis.get(
    buildSessionKey(sessionId)
  );

  if (!session) {
    return null;
  }

  return JSON.parse(session);
}

async function refreshSession(sessionId) {
  const session = await getSession(sessionId);

  if (!session) {
    return null;
  }

  session.lastActivity = new Date().toISOString();

  await redis.set(
    buildSessionKey(sessionId),
    JSON.stringify(session),
    DEFAULT_TTL
  );

  return session;
}

async function destroySession(sessionId) {
  const session = await getSession(sessionId);

  if (!session) {
    return;
  }

  await redis.del(buildSessionKey(sessionId));

  logger.info(
    {
      userId: session.userId,
      sessionId
    },
    "Session destroyed."
  );
}

async function destroyUserSessions(userId) {
  const sessions =
    await redis.hashGetAll(buildUserKey(userId));

  const ids = Object.keys(sessions);

  for (const sessionId of ids) {
    await redis.del(buildSessionKey(sessionId));
  }

  await redis.del(buildUserKey(userId));

  logger.info(
    {
      userId,
      sessions: ids.length
    },
    "All user sessions destroyed."
  );
}

async function sessionExists(sessionId) {
  return redis.exists(buildSessionKey(sessionId));
}

module.exports = {
  createSession,
  getSession,
  refreshSession,
  destroySession,
  destroyUserSessions,
  sessionExists
};
