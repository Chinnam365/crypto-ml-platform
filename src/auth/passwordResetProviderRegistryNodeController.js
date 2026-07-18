"use strict";

const PasswordResetProviderRegistryNodeService = require("./passwordResetProviderRegistryNodeService");
const ResponseBuilder = require("./responseBuilder");

class PasswordResetProviderRegistryNodeController {
  constructor(
    service = new PasswordResetProviderRegistryNodeService()
  ) {
    this.service = service;

    this.create = this.create.bind(this);
    this.list = this.list.bind(this);
    this.get = this.get.bind(this);
    this.remove = this.remove.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.heartbeat = this.heartbeat.bind(this);
  }

  create(req, res) {
    const node = this.service.create(req.body);

    return ResponseBuilder.send(
      res,
      ResponseBuilder.created(
        node.status(),
        "Node created successfully."
      )
    );
  }

  list(req, res) {
    const nodes = this.service
      .list()
      .map((node) => node.status());

    return ResponseBuilder.send(
      res,
      ResponseBuilder.success(
        nodes,
        "Nodes retrieved successfully."
      )
    );
  }

  get(req, res) {
    const node = this.service.findById(req.params.id);

    if (!node) {
      return ResponseBuilder.send(
        res,
        ResponseBuilder.notFound(
          "Node not found."
        )
      );
    }

    return ResponseBuilder.send(
      res,
      ResponseBuilder.success(
        node.status(),
        "Node retrieved successfully."
      )
    );
  }

  remove(req, res) {
    const removed = this.service.delete(req.params.id);

    return ResponseBuilder.send(
      res,
      ResponseBuilder.success(
        { removed },
        removed
          ? "Node deleted successfully."
          : "Node not found."
      )
    );
  }

  start(req, res) {
    const node = this.service.start(req.params.id);

    if (!node) {
      return ResponseBuilder.send(
        res,
        ResponseBuilder.notFound(
          "Node not found."
        )
      );
    }

    return ResponseBuilder.send(
      res,
      ResponseBuilder.success(
        node.status(),
        "Node started successfully."
      )
    );
  }

  stop(req, res) {
    const node = this.service.stop(req.params.id);

    if (!node) {
      return ResponseBuilder.send(
        res,
        ResponseBuilder.notFound(
          "Node not found."
        )
      );
    }

    return ResponseBuilder.send(
      res,
      ResponseBuilder.success(
        node.status(),
        "Node stopped successfully."
      )
    );
  }

  heartbeat(req, res) {
    const node = this.service.heartbeat(req.params.id);

    if (!node) {
      return ResponseBuilder.send(
        res,
        ResponseBuilder.notFound(
          "Node not found."
        )
      );
    }

    return ResponseBuilder.send(
      res,
      ResponseBuilder.success(
        node.status(),
        "Heartbeat updated successfully."
      )
    );
  }
}

module.exports = PasswordResetProviderRegistryNodeController;
