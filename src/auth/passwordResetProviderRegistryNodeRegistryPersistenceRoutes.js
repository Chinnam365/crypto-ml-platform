"use strict";

const express = require("express");

const PasswordResetProviderRegistryNodeRegistryPersistenceController = require("./passwordResetProviderRegistryNodeRegistryPersistenceController");

class PasswordResetProviderRegistryNodeRegistryPersistenceRoutes {
  constructor(options = {}) {
    this.router = express.Router();

    this.controller =
      options.controller ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceController(
        options
      );

    this.registerRoutes();
  }

  registerRoutes() {
    this.router.post(
      "/save",
      this.controller.save.bind(this.controller)
    );

    this.router.get(
      "/load",
      this.controller.load.bind(this.controller)
    );

    this.router.post(
      "/backup",
      this.controller.backup.bind(this.controller)
    );

    this.router.post(
      "/restore",
      this.controller.restore.bind(this.controller)
    );

    this.router.delete(
      "/delete",
      this.controller.remove.bind(this.controller)
    );
  }

  getRouter() {
    return this.router;
  }

  status() {
    return {
      routes:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRoutes",
      endpoints: [
        "POST /save",
        "GET /load",
        "POST /backup",
        "POST /restore",
        "DELETE /delete"
      ],
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRoutes;
