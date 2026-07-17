"use strict";

const { createClient } = require("redis");

const config = require("./environment");
const logger = require("./logger");

let client = null;
let connected = false;

async function createRedisClient() {
  if (client) {
    return client;
  }

  client = createClient({
    url: config.redis.url,
    socket: {
      reconnectStrategy(retries) {
        const delay = Math.min(retries * 200, 5000);

        logger.warn({
          retries,
          delay
        }, "Redis reconnect scheduled.");

        return delay;
      }
    }
  });

  client.on("connect", () => {
    logger.info("Connecting to Redis...");
  });

  client.on("ready", () => {
    connected = true;

    logger.info("Redis connection established.");
  });

  client.on("end", () => {
    connected = false;

    logger.warn("Redis connection closed.");
  });

  client.on("error", (err) => {
    connected = false;

    logger.error({
      err
    }, "Redis error.");
  });

  await client.connect();

  return client;
}

async function get(key) {
  const redis = await createRedisClient();

  return redis.get(key);
}

async function set(key, value, ttl = config.redis.ttl) {
  const redis = await createRedisClient();

  if (ttl && ttl > 0) {
    return redis.set(key, value, {
      EX: ttl
    });
  }

  return redis.set(key, value);
}

async function del(key) {
  const redis = await createRedisClient();

  return redis.del(key);
}

async function exists(key) {
  const redis = await createRedisClient();

  return (await redis.exists(key)) === 1;
}

async function expire(key, ttl) {
  const redis = await createRedisClient();

  return redis.expire(key, ttl);
}

async function increment(key) {
  const redis = await createRedisClient();

  return redis.incr(key);
}

async function decrement(key) {
  const redis = await createRedisClient();

  return redis.decr(key);
}

async function hashSet(key, field, value) {
  const redis = await createRedisClient();

  return redis.hSet(key, field, value);
}

async function hashGet(key, field) {
  const redis = await createRedisClient();

  return redis.hGet(key, field);
}

async function hashGetAll(key) {
  const redis = await createRedisClient();

  return redis.hGetAll(key);
}

async function publish(channel, message) {
  const redis = await createRedisClient();

  return redis.publish(channel, message);
}

async function ping() {
  const redis = await createRedisClient();

  return redis.ping();
}

async function flush() {
  const redis = await createRedisClient();

  return redis.flushDb();
}

async function disconnect() {
  if (!client) {
    return;
  }

  await client.quit();

  client = null;

  connected = false;

  logger.info("Redis disconnected.");
}

async function healthCheck() {
  try {
    await ping();

    return {
      healthy: true,
      connected
    };
  } catch (err) {
    return {
      healthy: false,
      connected: false,
      error: err.message
    };
  }
}

module.exports = {
  createRedisClient,
  get,
  set,
  del,
  exists,
  expire,
  increment,
  decrement,
  hashSet,
  hashGet,
  hashGetAll,
  publish,
  ping,
  flush,
  disconnect,
  healthCheck
};
