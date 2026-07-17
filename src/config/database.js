"use strict";

const { Pool } = require("pg");

const config = require("./environment");
const logger = require("./logger");

let pool = null;

function createPool() {
  if (pool) {
    return pool;
  }

  pool = new Pool({
    connectionString: config.database.url,

    ssl: config.database.ssl
      ? {
          rejectUnauthorized: false
        }
      : false,

    min: config.database.poolMin,

    max: config.database.poolMax,

    idleTimeoutMillis: config.database.idleTimeout,

    allowExitOnIdle: false
  });

  pool.on("connect", () => {
    logger.info("PostgreSQL connection established.");
  });

  pool.on("error", (err) => {
    logger.fatal(
      {
        err
      },
      "Unexpected PostgreSQL error."
    );
  });

  pool.on("remove", () => {
    logger.info("PostgreSQL client removed from pool.");
  });

  return pool;
}

async function query(text, params = []) {
  const db = createPool();

  const start = Date.now();

  try {
    const result = await db.query(text, params);

    const duration = Date.now() - start;

    logger.debug({
      sql: text,
      duration,
      rows: result.rowCount
    });

    return result;
  } catch (err) {
    logger.error(
      {
        err,
        sql: text
      },
      "Database query failed."
    );

    throw err;
  }
}

async function transaction(callback) {
  const db = createPool();

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const result = await callback(client);

    await client.query("COMMIT");

    return result;
  } catch (err) {
    await client.query("ROLLBACK");

    logger.error(
      {
        err
      },
      "Database transaction rolled back."
    );

    throw err;
  } finally {
    client.release();
  }
}

async function healthCheck() {
  try {
    await query("SELECT NOW()");

    return {
      healthy: true
    };
  } catch (err) {
    return {
      healthy: false,
      error: err.message
    };
  }
}

async function shutdown() {
  if (!pool) {
    return;
  }

  logger.info("Closing PostgreSQL connection pool...");

  await pool.end();

  pool = null;

  logger.info("PostgreSQL connection pool closed.");
}

module.exports = {
  createPool,
  query,
  transaction,
  healthCheck,
  shutdown
};
