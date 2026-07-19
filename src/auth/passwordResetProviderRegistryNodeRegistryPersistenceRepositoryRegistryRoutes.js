"use strict";

const express = require("express");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryController = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryController");

function createPasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRoutes(
  options = {}
) {
  const router = express.Router();

  const controller =
    options.controller ||
    new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryController(
      options
    );

  router.get("/status", (req, res) => {
    res.status(200).json(controller.status());
  });

  router.get("/", controller.list.bind(controller));

  router.get("/:name", controller.get.bind(controller));

  router.post("/:name", controller.register.bind(controller));

  router.delete("/:name", controller.unregister.bind(controller));

  return router;
}

module.exports =
  createPasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRoutes;
