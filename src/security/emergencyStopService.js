"use strict";

const redis = require("../config/redis");
const logger = require("../config/logger");
const auditLogger = require("./auditLogger");

const GLOBAL_KEY = "guardian:emergency-stop";
const REASON_KEY = "guardian:emergency-stop:reason";
const USER_KEY = "guardian:emergency-stop:user";
const TIME_KEY = "guardian:emergency-stop:time";

async function activate({
  userId,
  reason,
  requestId = null,
  ipAddress = null,
  userAgent = null
}) {
  const timestamp = new Date().toISOString();

  await redis.set(GLOBAL_KEY, "true", 0);
  await redis.set(REASON_KEY, reason || "Emergency Stop Activated", 0);
  await redis.set(USER_KEY, userId || "SYSTEM", 0);
  await redis.set(TIME_KEY, timestamp, 0);

  await auditLogger.emergencyStop({
    userId,
    requestId,
    ipAddress,
    userAgent,
    metadata: {
      reason,
      activatedAt: timestamp
    }
  });

  logger.fatal(
    {
      userId,
      reason
    },
    "GLOBAL EMERGENCY STOP ACTIVATED"
  );

  return {
    active: true,
    activatedAt: timestamp,
    reason
  };
}

async function deactivate({
  userId,
  requestId = null,
  ipAddress = null,
  userAgent = null
}) {
  await redis.del(GLOBAL_KEY);
  await redis.del(REASON_KEY);
  await redis.del(USER_KEY);
  await redis.del(TIME_KEY);

  await auditLogger.configurationChanged({
    userId,
    requestId,
    ipAddress,
    userAgent,
    metadata: {
      action: "Emergency Stop Released"
    }
  });

  logger.warn(
    {
      userId
    },
    "Emergency Stop Released"
  );

  return {
    active: false
  };
}

async function isActive() {
  return redis.exists(GLOBAL_KEY);
}

async function getStatus() {
  const active = await redis.exists(GLOBAL_KEY);

  if (!active) {
    return {
      active: false
    };
  }

  const reason = await redis.get(REASON_KEY);
  const userId = await redis.get(USER_KEY);
  const activatedAt = await redis.get(TIME_KEY);

  return {
    active: true,
    reason,
    activatedBy: userId,
    activatedAt
  };
}

async function assertTradingAllowed() {
  const active = await isActive();

  if (active) {
    const status = await getStatus();

    const error = new Error(
      `Trading disabled. Emergency Stop is active. Reason: ${status.reason}`
    );

    error.code = "EMERGENCY_STOP_ACTIVE";

    throw error;
  }
}

module.exports = {
  activate,
  deactivate,
  isActive,
  getStatus,
  assertTradingAllowed
};
