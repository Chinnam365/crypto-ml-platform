"use strict";

const database = require("../config/database");
const redis = require("../config/redis");
const logger = require("../config/logger");
const emergencyStopService = require("./emergencyStopService");

async function getHealthReport() {
  const report = {
    timestamp: new Date().toISOString(),
    overall: "HEALTHY",
    checks: {}
  };

  report.checks.database =
    await database.healthCheck();

  report.checks.redis =
    await redis.healthCheck();

  report.checks.emergencyStop =
    await emergencyStopService.getStatus();

  report.checks.environment = {
    healthy: true,
    nodeVersion: process.version,
    uptimeSeconds: Math.floor(process.uptime()),
    memory: process.memoryUsage(),
    cpuLoad: process.cpuUsage()
  };

  report.checks.security = {
    jwtLoaded:
      !!process.env.JWT_ACCESS_SECRET &&
      !!process.env.JWT_REFRESH_SECRET,

    encryptionLoaded:
      !!process.env.ENCRYPTION_KEY,

    exchangeKeysLoaded:
      !!process.env.EXCHANGE_API_KEY &&
      !!process.env.EXCHANGE_API_SECRET
  };

  const unhealthy = Object.values(report.checks).some(
    (item) =>
      item &&
      item.healthy === false
  );

  if (unhealthy) {
    report.overall = "DEGRADED";
  }

  if (report.checks.emergencyStop.active) {
    report.overall = "EMERGENCY_STOP";
  }

  return report;
}

async function logHealthReport() {
  const report = await getHealthReport();

  logger.info(
    {
      overall: report.overall
    },
    "Security health report generated."
  );

  return report;
}

module.exports = {
  getHealthReport,
  logHealthReport
};
