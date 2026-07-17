"use strict";

const crypto = require("crypto");

const database = require("../config/database");
const logger = require("../config/logger");
const encryptionService = require("./encryptionService");
const AppError = require("../utils/AppError");

const TABLE = "encrypted_secrets";

async function rotateSecret({
  userId,
  category,
  name,
  newValue,
  rotatedBy = null
}) {
  const existing = await database.query(
    `
    SELECT
      id,
      encrypted_value
    FROM ${TABLE}
    WHERE
      user_id=$1
      AND category=$2
      AND secret_name=$3
      AND deleted_at IS NULL
    LIMIT 1
    `,
    [
      userId,
      category,
      name
    ]
  );

  if (existing.rowCount === 0) {
    throw AppError.notFound("Secret not found.");
  }

  const previousValue = encryptionService.decrypt(
    existing.rows[0].encrypted_value
  );

  const encrypted =
    encryptionService.encrypt(newValue);

  const hash =
    encryptionService.hash(newValue);

  await database.transaction(async (client) => {

    await client.query(
      `
      INSERT INTO secret_rotation_history
      (
        secret_id,
        previous_hash,
        rotated_by,
        rotated_at
      )
      VALUES
      (
        $1,$2,$3,NOW()
      )
      `,
      [
        existing.rows[0].id,
        encryptionService.hash(previousValue),
        rotatedBy
      ]
    );

    await client.query(
      `
      UPDATE ${TABLE}
      SET
        encrypted_value=$2,
        secret_hash=$3,
        updated_by=$4,
        updated_at=NOW()
      WHERE id=$1
      `,
      [
        existing.rows[0].id,
        encrypted,
        hash,
        rotatedBy
      ]
    );
  });

  logger.info(
    {
      userId,
      category,
      secret: name
    },
    "Secret rotated successfully."
  );

  return true;
}

async function needsRotation(secretId, maxAgeDays = 90) {
  const result = await database.query(
    `
    SELECT
      updated_at
    FROM ${TABLE}
    WHERE id=$1
    `,
    [secretId]
  );

  if (result.rowCount === 0) {
    throw AppError.notFound("Secret not found.");
  }

  const updated =
    new Date(result.rows[0].updated_at);

  const age =
    (Date.now() - updated.getTime()) /
    (1000 * 60 * 60 * 24);

  return age >= maxAgeDays;
}

function generateExchangeSecret() {
  return crypto.randomBytes(64).toString("hex");
}

function generateJwtSecret() {
  return crypto.randomBytes(128).toString("base64");
}

function generateEncryptionKey() {
  return crypto.randomBytes(32).toString("hex");
}

module.exports = {
  rotateSecret,
  needsRotation,
  generateExchangeSecret,
  generateJwtSecret,
  generateEncryptionKey
};
