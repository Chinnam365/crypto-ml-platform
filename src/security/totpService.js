"use strict";

const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

const config = require("../config/environment");
const encryptionService = require("./encryptionService");
const logger = require("../config/logger");
const AppError = require("../utils/AppError");

const ISSUER = config.app.name;

async function generateSecret(userId, email = "owner@aios.local") {
  const secret = speakeasy.generateSecret({
    name: `${ISSUER} (${email})`,
    issuer: ISSUER,
    length: 32
  });

  const qrCode = await QRCode.toDataURL(secret.otpauth_url);

  logger.info(
    {
      userId
    },
    "TOTP secret generated."
  );

  return {
    secret: encryptionService.encrypt(secret.base32),
    plainSecret: secret.base32,
    otpauth: secret.otpauth_url,
    qrCode
  };
}

function verifyToken(encryptedSecret, token) {
  if (!encryptedSecret) {
    throw AppError.badRequest(
      "MFA secret has not been configured."
    );
  }

  const secret =
    encryptionService.decrypt(encryptedSecret);

  const verified = speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token: String(token),
    window: 1
  });

  return verified;
}

function generateCurrentToken(encryptedSecret) {
  const secret =
    encryptionService.decrypt(encryptedSecret);

  return speakeasy.totp({
    secret,
    encoding: "base32"
  });
}

function generateBackupCodes(count = 10) {
  const codes = [];

  for (let i = 0; i < count; i++) {
    const code = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();

    codes.push({
      code,
      hash: encryptionService.hash(code)
    });
  }

  return codes;
}

function verifyBackupCode(code, hashes) {
  const hashed =
    encryptionService.hash(code);

  const index = hashes.findIndex(
    (item) => item.hash === hashed
  );

  if (index === -1) {
    return {
      valid: false,
      remaining: hashes
    };
  }

  hashes.splice(index, 1);

  return {
    valid: true,
    remaining: hashes
  };
}

module.exports = {
  generateSecret,
  verifyToken,
  generateCurrentToken,
  generateBackupCodes,
  verifyBackupCode
};
