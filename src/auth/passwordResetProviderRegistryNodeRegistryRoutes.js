"use strict";

const express = require("express");
const PasswordResetProviderRegistryNodeRegistryController = require("./passwordResetProviderRegistryNodeRegistryController");

function createPasswordResetProviderRegistryNodeRegistryRouter(
  controller = new PasswordResetProviderRegistryNodeRegistryController()
) {
  const router = express.Router();

  router.post(
    "/",
    controller.register
  );

  router.get(
    "/",
    controller.list
  );

  router.get(
    "/status",
    controller.status
  );

  router.get(
    "/:id",
    controller.get
  );

  router.delete(
    "/:id",
    controller.unregister
  );

  return router;
}

module.exports =
  createPasswordResetProviderRegistryNodeRegistryRouter;
