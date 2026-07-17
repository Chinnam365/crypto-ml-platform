"use strict";

const crypto = require("crypto");

const config = require("../config/environment");

const ALGORITHM = config.encryption.algorithm;
const KEY = config.encryption.key;

function encrypt(plainText) {
  if (plainText === undefined || plainText === null) {
    return null;
  }

  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(
    ALGORITHM,
    KEY,
    iv
  );

  let encrypted = cipher.update(
    String(plainText),
    "utf8",
    "base64"
  );

  encrypted += cipher.final("base64");

  const authTag = cipher.getAuthTag();

  return JSON.stringify({
    algorithm: ALGORITHM,
    iv: iv.toString("base64"),
    tag: authTag.toString("base64"),
    value: encrypted
  });
}

function decrypt(payload) {
  if (!payload) {
    return null;
  }

  const data =
    typeof payload === "string"
      ? JSON.parse(payload)
      : payload;

  const decipher = crypto.createDecipheriv(
    data.algorithm,
    KEY,
    Buffer.from(data.iv, "base64")
  );

  decipher.setAuthTag(
    Buffer.from(data.tag, "base64")
  );

  let decrypted = decipher.update(
    data.value,
    "base64",
    "utf8"
  );

  decrypted += decipher.final("utf8");

  return decrypted;
}

function encryptObject(object) {
  return encrypt(JSON.stringify(object));
}

function decryptObject(payload) {
  return JSON.parse(decrypt(payload));
}

function generateSecret(length = 64) {
  return crypto.randomBytes(length).toString("hex");
}

function hash(value, algorithm = "sha256") {
  return crypto
    .createHash(algorithm)
    .update(String(value))
    .digest("hex");
}

function secureCompare(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));

  if (a.length !== b.length) {
    return false;
  }

  return crypto.timingSafeEqual(a, b);
}

function generateApiKey(prefix = "aios") {
  const id = crypto.randomUUID().replace(/-/g, "");

  const secret = crypto.randomBytes(32).toString("hex");

  return {
    key: `${prefix}_${id}`,
    secret
  };
}

module.exports = {
  encrypt,
  decrypt,
  encryptObject,
  decryptObject,
  generateSecret,
  generateApiKey,
  hash,
  secureCompare
};
