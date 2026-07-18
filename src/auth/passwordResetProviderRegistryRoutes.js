"use strict";

const express = require("express");
const PasswordResetProviderRegistryController = require("./passwordResetProviderRegistryController");

function createPasswordResetProviderRegistryRouter(
  controller = new PasswordResetProviderRegistryController()
) {
  const router = express.Router();

  router.get(
    "/",
    controller.list
  );

  router.get(
    "/health",
    controller.health
  );

  router.get(
    "/diagnostics",
    controller.diagnostics
  );

  router.get(
    "/report",
    controller.report
  );

  router.get(
    "/:type",
    controller.get
  );

  router.post(
    "/",
    controller.register
  );

  router.delete(
    "/:type",
    controller.unregister
  );

  return router;
}

module.exports =
  createPasswordResetProviderRegistryRouter;
