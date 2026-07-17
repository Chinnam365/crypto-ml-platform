"use strict";

const moduleInstance = require("./authModule");
const bootstrap = require("./authBootstrap");
const controller = require("./authController");
const service = require("./authService");
const repository = require("./authRepository");
const routes = require("./authRoutes");
const middleware = require("./authMiddleware");
const constants = require("./authConstants");
const health = require("./authHealthService");

module.exports = Object.freeze({

  initialize: async () => {
    return moduleInstance.initialize();
  },

  shutdown: async () => {
    return moduleInstance.shutdown();
  },

  router: routes,

  bootstrap,

  controller,

  service,

  repository,

  middleware,

  constants,

  health

});
