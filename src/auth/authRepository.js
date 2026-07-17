"use strict";

const database = require("../config/database");
const AppError = require("../utils/AppError");

const TABLE = "users";

async function findById(userId) {
  const result = await database.query(
    `
    SELECT
      id,
      email,
      password_hash,
      role,
      mfa_enabled,
      mfa_secret,
      failed_login_attempts,
      locked_until,
      last_login_at,
      created_at,
      updated_at
    FROM ${TABLE}
    WHERE id = $1
    LIMIT 1
    `,
    [userId]
  );

  return result.rows[0] || null;
}

async function findByEmail(email) {
  const result = await database.query(
    `
    SELECT
      id,
      email,
      password_hash,
      role,
      mfa_enabled,
      mfa_secret,
      failed_login_attempts,
      locked_until,
      last_login_at,
      created_at,
      updated_at
    FROM ${TABLE}
    WHERE LOWER(email)=LOWER($1)
    LIMIT 1
    `,
    [email]
  );

  return result.rows[0] || null;
}

async function updateLastLogin(userId) {
  await database.query(
    `
    UPDATE ${TABLE}
    SET
      last_login_at = NOW(),
      failed_login_attempts = 0,
      locked_until = NULL,
      updated_at = NOW()
    WHERE id = $1
    `,
    [userId]
  );
}

async function incrementFailedLogin(userId) {
  await database.query(
    `
    UPDATE ${TABLE}
    SET
      failed_login_attempts = failed_login_attempts + 1,
      updated_at = NOW()
    WHERE id = $1
    `,
    [userId]
  );
}

async function lockAccount(userId, minutes = 30) {
  await database.query(
    `
    UPDATE ${TABLE}
    SET
      locked_until = NOW() + ($2 * INTERVAL '1 minute'),
      updated_at = NOW()
    WHERE id = $1
    `,
    [
      userId,
      minutes
    ]
  );
}

async function updatePassword(userId, passwordHash) {
  const result = await database.query(
    `
    UPDATE ${TABLE}
    SET
      password_hash = $2,
      updated_at = NOW()
    WHERE id = $1
    `,
    [
      userId,
      passwordHash
    ]
  );

  if (result.rowCount === 0) {
    throw AppError.notFound("User not found.");
  }
}

async function enableMfa(userId, encryptedSecret) {
  await database.query(
    `
    UPDATE ${TABLE}
    SET
      mfa_enabled = TRUE,
      mfa_secret = $2,
      updated_at = NOW()
    WHERE id = $1
    `,
    [
      userId,
      encryptedSecret
    ]
  );
}

async function disableMfa(userId) {
  await database.query(
    `
    UPDATE ${TABLE}
    SET
      mfa_enabled = FALSE,
      mfa_secret = NULL,
      updated_at = NOW()
    WHERE id = $1
    `,
    [userId]
  );
}

module.exports = {
  findById,
  findByEmail,
  updateLastLogin,
  incrementFailedLogin,
  lockAccount,
  updatePassword,
  enableMfa,
  disableMfa
};
