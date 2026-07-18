"use strict";

const PasswordResetService = require("./passwordResetService");
const PasswordResetController = require("./passwordResetController");
const createPasswordResetRouter = require("./passwordResetRoutes");

class PasswordResetModule {
  constructor(options = {}) {
    this.service =
      options.service ||
      new PasswordResetService(options.serviceOptions);

    this.controller =
      options.controller ||
      new PasswordResetController(this.service);

    this.router =
      options.router ||
      createPasswordResetRouter(this.controller);
  }

  getService() {
    return this.service;
  }

  getController() {
    return this.controller;
  }

  getRouter() {
    return this.router;
  }

  initialize() {
    return this;
  }

  shutdown() {
    if (typeof this.service.cleanup === "function") {
      this.service.cleanup();
    }

    return true;
  }

  getMetadata() {
    return {
      name: "PasswordResetModule",
      version: "1.0.0",
      initialized: true
    };
  }
}

module.exports = PasswordResetModule;
