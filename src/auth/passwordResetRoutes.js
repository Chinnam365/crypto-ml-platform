"use strict";

const express = require("express");
const PasswordResetController = require("./passwordResetController");

function createPasswordResetRouter(
  controller = new PasswordResetController()
) {
  const router = express.Router();

  router.post(
    "/create",
    controller.create
  );

  router.get(
    "/validate/:token",
    controller.validate
  );

  router.post(
    "/consume",
    controller.consume
  );

  router.delete(
    "/:token",
    controller.revoke
  );

  return router;
}

module.exports = createPasswordResetRouter;
