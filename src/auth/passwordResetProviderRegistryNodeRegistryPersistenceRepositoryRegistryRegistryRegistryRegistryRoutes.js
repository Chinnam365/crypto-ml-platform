"use strict";

const express = require("express");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryController = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryController");

function createPasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRoutes(
  options = {}
) {
  const router = express.Router();

  const controller =
    options.controller ||
    new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryController(
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
  createPasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRoutes;
