"use strict";

const bcrypt = require("bcrypt");

const config = require("../config/environment");
const AppError = require("../utils/AppError");

const ROUNDS = config.security.bcryptRounds;

async function hashPassword(password) {
  validatePassword(password);

  return bcrypt.hash(password, ROUNDS);
}

async function verifyPassword(password, passwordHash) {
  if (!password || !passwordHash) {
    return false;
  }

  return bcrypt.compare(password, passwordHash);
}

function validatePassword(password) {
  if (typeof password !== "string") {
    throw AppError.validation("Password must be a string.");
  }

  if (password.length < 12) {
    throw AppError.validation(
      "Password must be at least 12 characters long."
    );
  }

  if (password.length > 128) {
    throw AppError.validation(
      "Password exceeds maximum allowed length."
    );
  }

  if (!/[A-Z]/.test(password)) {
    throw AppError.validation(
      "Password must contain at least one uppercase letter."
    );
  }

  if (!/[a-z]/.test(password)) {
    throw AppError.validation(
      "Password must contain at least one lowercase letter."
    );
  }

  if (!/[0-9]/.test(password)) {
    throw AppError.validation(
      "Password must contain at least one numeric character."
    );
  }

  if (!/[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]/.test(password)) {
    throw AppError.validation(
      "Password must contain at least one special character."
    );
  }

  const commonPasswords = new Set([
    "Password123!",
    "Admin123!",
    "Welcome123!",
    "Qwerty123!",
    "Letmein123!"
  ]);

  if (commonPasswords.has(password)) {
    throw AppError.validation(
      "Password is too common."
    );
  }

  return true;
}

async function needsRehash(passwordHash) {
  try {
    const rounds = bcrypt.getRounds(passwordHash);

    return rounds < ROUNDS;
  } catch {
    return true;
  }
}

async function upgradeHash(password, existingHash) {
  if (!(await verifyPassword(password, existingHash))) {
    throw AppError.unauthorized(
      "Password verification failed."
    );
  }

  if (!(await needsRehash(existingHash))) {
    return existingHash;
  }

  return hashPassword(password);
}

module.exports = {
  hashPassword,
  verifyPassword,
  validatePassword,
  needsRehash,
  upgradeHash
};
