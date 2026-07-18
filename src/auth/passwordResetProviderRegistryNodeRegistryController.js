"use strict";

const PasswordResetProviderRegistryNodeRegistryService = require("./passwordResetProviderRegistryNodeRegistryService");
const ResponseBuilder = require("./responseBuilder");

class PasswordResetProviderRegistryNodeRegistryController {
  constructor(
    service = new PasswordResetProviderRegistryNodeRegistryService()
  ) {
    this.service = service;

    this.register = this.register.bind(this);
    this.unregister = this.unregister.bind(this);
    this.get = this.get.bind(this);
    this.list = this.list.bind(this);
    this.status = this.status.bind(this);
  }

  register(req, res) {
    const { id } = req.body;

    const node = this.service.register(id, req.app);

    return ResponseBuilder.send(
      res,
      ResponseBuilder.created(
        node,
        "Registry node registered successfully."
      )
    );
  }

  unregister(req, res) {
    const removed = this.service.unregister(
      req.params.id
    );

    return ResponseBuilder.send(
      res,
      ResponseBuilder.success(
        { removed },
        removed
          ? "Registry node removed successfully."
          : "Registry node not found."
      )
    );
  }

  get(req, res) {
    const node = this.service.get(req.params.id);

    if (!node) {
      return ResponseBuilder.send(
        res,
        ResponseBuilder.notFound(
          "Registry node not found."
        )
      );
    }

    return ResponseBuilder.send(
      res,
      ResponseBuilder.success(
        node,
        "Registry node retrieved successfully."
      )
    );
  }

  list(req, res) {
    return ResponseBuilder.send(
      res,
      ResponseBuilder.success(
        this.service.list(),
        "Registry nodes retrieved successfully."
      )
    );
  }

  status(req, res) {
    return ResponseBuilder.send(
      res,
      ResponseBuilder.success(
        this.service.status(),
        "Registry status retrieved successfully."
      )
    );
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryController;
