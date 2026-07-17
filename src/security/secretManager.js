"use strict";

const encryptionService = require("./encryptionService");
const database = require("../config/database");
const logger = require("../config/logger");
const AppError = require("../utils/AppError");

const TABLE = "encrypted_secrets";

async function createSecret({
  userId,
  category,
  name,
  value,
  description = null,
  createdBy = null
}) {
  const encryptedValue =
    encryptionService.encrypt(value);

  const secretHash =
    encryptionService.hash(value);

  const result = await database.query(
    `
    INSERT INTO ${TABLE}
    (
      user_id,
      category,
      secret_name,
      encrypted_value,
      secret_hash,
      description,
      created_by,
      created_at,
      updated_at
    )
    VALUES
    (
      $1,$2,$3,$4,$5,$6,$7,NOW(),NOW()
    )
    RETURNING id
    `,
    [
      userId,
      category,
      name,
      encryptedValue,
      secretHash,
      description,
      createdBy
    ]
  );

  logger.info(
    {
      userId,
      category,
      secret: name
    },
    "Secret stored."
  );

  return result.rows[0];
}

async function getSecret(userId, category, name) {
  const result = await database.query(
    `
    SELECT encrypted_value
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

  if (result.rowCount === 0) {
    throw AppError.notFound(
      "Secret not found."
    );
  }

  return encryptionService.decrypt(
    result.rows[0].encrypted_value
  );
}

async function updateSecret({
  userId,
  category,
  name,
  value,
  updatedBy = null
}) {
  const encrypted =
    encryptionService.encrypt(value);

  const hash =
    encryptionService.hash(value);

  const result = await database.query(
    `
    UPDATE ${TABLE}
    SET
      encrypted_value=$4,
      secret_hash=$5,
      updated_by=$6,
      updated_at=NOW()
    WHERE
      user_id=$1
      AND category=$2
      AND secret_name=$3
      AND deleted_at IS NULL
    `,
    [
      userId,
      category,
      name,
      encrypted,
      hash,
      updatedBy
    ]
  );

  if (result.rowCount === 0) {
    throw AppError.notFound(
      "Secret not found."
    );
  }

  logger.info(
    {
      userId,
      category,
      secret: name
    },
    "Secret updated."
  );
}

async function deleteSecret(
  userId,
  category,
  name
) {
  await database.query(
    `
    UPDATE ${TABLE}
    SET
      deleted_at=NOW()
    WHERE
      user_id=$1
      AND category=$2
      AND secret_name=$3
    `,
    [
      userId,
      category,
      name
    ]
  );

  logger.info(
    {
      userId,
      category,
      secret: name
    },
    "Secret deleted."
  );
}

async function listSecrets(userId) {
  const result = await database.query(
    `
    SELECT
      id,
      category,
      secret_name,
      description,
      created_at,
      updated_at
    FROM ${TABLE}
    WHERE
      user_id=$1
      AND deleted_at IS NULL
    ORDER BY
      category,
      secret_name
    `,
    [userId]
  );

  return result.rows;
}

module.exports = {
  createSecret,
  getSecret,
  updateSecret,
  deleteSecret,
  listSecrets
};
