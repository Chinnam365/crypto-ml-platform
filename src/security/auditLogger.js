"use strict";

const os = require("os");

const database = require("../config/database");
const logger = require("../config/logger");

const TABLE = "security_audit_log";

async function log({
  userId = null,
  action,
  category = "SECURITY",
  status = "SUCCESS",
  resource = null,
  resourceId = null,
  ipAddress = null,
  userAgent = null,
  requestId = null,
  sessionId = null,
  metadata = {},
  errorMessage = null
}) {
  try {
    await database.query(
      `
      INSERT INTO ${TABLE}
      (
        user_id,
        action,
        category,
        status,
        resource,
        resource_id,
        ip_address,
        user_agent,
        request_id,
        session_id,
        hostname,
        metadata,
        error_message,
        created_at
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW()
      )
      `,
      [
        userId,
        action,
        category,
        status,
        resource,
        resourceId,
        ipAddress,
        userAgent,
        requestId,
        sessionId,
        os.hostname(),
        JSON.stringify(metadata),
        errorMessage
      ]
    );
  } catch (err) {
    logger.error(
      {
        err,
        action
      },
      "Failed to write security audit log."
    );
  }
}

async function loginSuccess(context) {
  return log({
    ...context,
    action: "LOGIN",
    status: "SUCCESS"
  });
}

async function loginFailure(context) {
  return log({
    ...context,
    action: "LOGIN",
    status: "FAILED"
  });
}

async function logout(context) {
  return log({
    ...context,
    action: "LOGOUT",
    status: "SUCCESS"
  });
}

async function tokenIssued(context) {
  return log({
    ...context,
    action: "TOKEN_ISSUED"
  });
}

async function tokenRevoked(context) {
  return log({
    ...context,
    action: "TOKEN_REVOKED"
  });
}

async function mfaEnabled(context) {
  return log({
    ...context,
    action: "MFA_ENABLED"
  });
}

async function mfaDisabled(context) {
  return log({
    ...context,
    action: "MFA_DISABLED"
  });
}

async function mfaFailure(context) {
  return log({
    ...context,
    action: "MFA_VERIFICATION",
    status: "FAILED"
  });
}

async function apiKeyCreated(context) {
  return log({
    ...context,
    action: "API_KEY_CREATED"
  });
}

async function apiKeyDeleted(context) {
  return log({
    ...context,
    action: "API_KEY_DELETED"
  });
}

async function exchangeAccess(context) {
  return log({
    ...context,
    action: "EXCHANGE_ACCESS",
    category: "EXCHANGE"
  });
}

async function emergencyStop(context) {
  return log({
    ...context,
    action: "EMERGENCY_STOP",
    category: "SYSTEM"
  });
}

async function configurationChanged(context) {
  return log({
    ...context,
    action: "CONFIGURATION_CHANGED",
    category: "SYSTEM"
  });
}

module.exports = {
  log,
  loginSuccess,
  loginFailure,
  logout,
  tokenIssued,
  tokenRevoked,
  mfaEnabled,
  mfaDisabled,
  mfaFailure,
  apiKeyCreated,
  apiKeyDeleted,
  exchangeAccess,
  emergencyStop,
  configurationChanged
};
