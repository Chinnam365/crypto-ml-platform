"use strict";

const logger = require("../config/logger");
const config = require("../config/environment");

const authRepository = require("./authRepository");
const security = require("../security");

class AuthBootstrap {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) {
      return;
    }

    logger.info("Initializing Authentication Module...");

    await this.validateOwnerAccount();

    this.initialized = true;

    logger.info("Authentication Module Initialized.");
  }

  async validateOwnerAccount() {
    const owner = await authRepository.findById(
      config.owner.userId
    );

    if (!owner) {
      throw new Error(
        `Owner account '${config.owner.userId}' was not found.`
      );
    }

    if (!owner.password_hash) {
      throw new Error(
        "Owner account does not have a password configured."
      );
    }

    const needsUpgrade =
      await security.password.needsRehash(
        owner.password_hash
      );

    if (needsUpgrade) {
      logger.warn(
        {
          userId: owner.id
        },
        "Owner password hash should be upgraded."
      );
    }

    logger.info(
      {
        userId: owner.id,
        role: owner.role,
        mfaEnabled: owner.mfa_enabled
      },
      "Owner account validation passed."
    );
  }

  async shutdown() {
    logger.info(
      "Authentication Module shutdown completed."
    );
  }
}

module.exports = new AuthBootstrap();
