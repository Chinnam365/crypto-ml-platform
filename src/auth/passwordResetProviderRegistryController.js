"use strict";

const PasswordResetProviderRegistryService = require("./passwordResetProviderRegistryService");
const ResponseBuilder = require("./responseBuilder");

class PasswordResetProviderRegistryController {
  constructor(
    service = new PasswordResetProviderRegistryService()
  ) {
    this.service = service;

    this.list = this.list.bind(this);
    this.get = this.get.bind(this);
    this.register = this.register.bind(this);
    this.unregister = this.unregister.bind(this);
    this.health = this.health.bind(this);
    this.diagnostics = this.diagnostics.bind(this);
    this.report = this.report.bind(this);
  }

  async list(req, res) {
    return ResponseBuilder.send(
      res,
      ResponseBuilder.success(
        this.service.list(),
        "Providers retrieved successfully."
      )
    );
  }

  async get(req, res) {
    const provider = this.service.get(
      req.params.type
    );

    if (!provider) {
      return ResponseBuilder.send(
        res,
        ResponseBuilder.notFound(
          "Provider not found."
        )
      );
    }

    return ResponseBuilder.send(
      res,
      ResponseBuilder.success(
        provider,
        "Provider retrieved successfully."
      )
    );
  }

  async register(req, res) {
    const provider = this.service.register(
      req.body.type
    );

    return ResponseBuilder.send(
      res,
      ResponseBuilder.created(
        provider,
        "Provider registered successfully."
      )
    );
  }

  async unregister(req, res) {
    const removed =
      this.service.unregister(
        req.params.type
      );

    return ResponseBuilder.send(
      res,
      ResponseBuilder.success(
        { removed },
        removed
          ? "Provider unregistered successfully."
          : "Provider not found."
      )
    );
  }

  async health(req, res) {
    return ResponseBuilder.send(
      res,
      ResponseBuilder.success(
        await this.service.health(),
        "Health check completed."
      )
    );
  }

  async diagnostics(req, res) {
    return ResponseBuilder.send(
      res,
      ResponseBuilder.success(
        await this.service.diagnostics(),
        "Diagnostics completed."
      )
    );
  }

  async report(req, res) {
    return ResponseBuilder.send(
      res,
      ResponseBuilder.success(
        await this.service.report(),
        "Report generated successfully."
      )
    );
  }
}

module.exports =
  PasswordResetProviderRegistryController;
