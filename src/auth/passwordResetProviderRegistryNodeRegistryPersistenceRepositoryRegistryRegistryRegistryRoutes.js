"use strict";

const express = require("express");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryController = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryController");

function createPasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRoutes(
  options = {}
) {
  const router = express.Router();

  const controller =
    options.controller ||
    new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryController(
      options
    );

  router.get("/status", (req, res) => {
    res.status(200).json(controller.status());
  });

  router.get("/", controller.list.bind(controller));

  router.get("/:name", controller.get.bind(controller));

  router.post("/:name", controller.create.bind(controller));

  router.delete("/:name", controller.remove.bind(controller));

  return router;
}

module.exports =
  createPasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRoutes;
