"use strict";

const router = require("./authRoutes");
const service = require("./authService");
const repository = require("./authRepository");
const controller = require("./authController");
const constants = require("./authConstants");

module.exports = Object.freeze({
  router,
  service,
  repository,
  controller,
  constants
});
