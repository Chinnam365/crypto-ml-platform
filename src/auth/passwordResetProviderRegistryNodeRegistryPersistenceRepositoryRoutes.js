"use strict";

const express = require("express");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryController = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryController");

function createPasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRoutes(
  options = {}
) {
  const router = express.Router();

  const controller =
    options.controller ||
    new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryController(
      options
    );

  router.get("/status", (req, res) => {
    res.status(200).json(controller.status());
  });

  router.get("/", controller.findAll.bind(controller));

  router.get("/:id", controller.findById.bind(controller));

  router.post("/:id", controller.save.bind(controller));

  router.put("/:id", controller.update.bind(controller));

  router.delete("/:id", controller.delete.bind(controller));

  return router;
}

module.exports =
  createPasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRoutes;
