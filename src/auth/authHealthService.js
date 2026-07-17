"use strict";

const database = require("../config/database");
const redis = require("../config/redis");
const logger = require("../config/logger");

const authRepository = require("./authRepository");

async function getHealthReport() {
  const report = {
    module: "Authentication",
    timestamp: new Date().toISOString(),
    status: "HEALTHY",
    checks: {}
  };

  report.checks.database =
    await database.healthCheck();

  report.checks.redis =
    await redis.healthCheck();

  report.checks.owner = await validateOwner();

  report.checks.jwt = {
    healthy:
      !!process.env.JWT_ACCESS_SECRET &&
      !!process.env.JWT_REFRESH_SECRET
  };

  report.checks.encryption = {
    healthy: !!process.env.ENCRYPTION_KEY
  };

  const failed = Object.values(report.checks).some(
    (item) => item && item.healthy === false
  );

  if (failed) {
    report.status = "DEGRADED";
  }

  return report;
}

async function validateOwner() {
  try {
    const owner =
      await authRepository.findById(
        process.env.OWNER_USER_ID
      );

    if (!owner) {
      return {
        healthy: false,
        reason: "Owner account not found."
      };
    }

    return {
      healthy: true,
      userId: owner.id,
      role: owner.role,
      mfaEnabled: owner.mfa_enabled
    };
  } catch (err) {
    return {
      healthy: false,
      reason: err.message
    };
  }
}

async function logHealthReport() {
  const report = await getHealthReport();

  logger.info(
    {
      module: report.module,
      status: report.status
    },
    "Authentication health report generated."
  );

  return report;
}

module.exports = {
  getHealthReport,
  logHealthReport
};
