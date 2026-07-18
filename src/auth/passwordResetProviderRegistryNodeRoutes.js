"use strict";

const express = require("express");
const PasswordResetProviderRegistryNodeController = require("./passwordResetProviderRegistryNodeController");

function createPasswordResetProviderRegistryNodeRouter(
  controller = new PasswordResetProviderRegistryNodeController()
) {
  const router = express.Router();

  router.post(
    "/",
    controller.create
  );

  router.get(
    "/",
    controller.list
  );

  router.get(
    "/:id",
    controller.get
  );

  router.post(
    "/:id/start",
    controller.start
  );

  router.post(
    "/:id/stop",
    controller.stop
  );

  router.post(
    "/:id/heartbeat",
    controller.heartbeat
  );

  router.delete(
    "/:id",
    controller.remove
  );

  return router;
}

module.exports =
  createPasswordResetProviderRegistryNodeRouter;
