"use strict";

const PasswordResetService = require("./passwordResetService");
const ResponseBuilder = require("./responseBuilder");

class PasswordResetController {
  constructor(service = new PasswordResetService()) {
    this.service = service;

    this.create = this.create.bind(this);
    this.validate = this.validate.bind(this);
    this.consume = this.consume.bind(this);
    this.revoke = this.revoke.bind(this);
  }

  create(req, res) {
    const { userId } = req.body;

    const result = this.service.create(userId);

    return ResponseBuilder.send(
      res,
      ResponseBuilder.created(
        result,
        "Password reset token created."
      )
    );
  }

  validate(req, res) {
    const { token } = req.params;

    const result = this.service.validate(token);

    if (!result.valid) {
      return ResponseBuilder.send(
        res,
        ResponseBuilder.error(
          400,
          result.reason,
          "Password reset token is invalid."
        )
      );
    }

    return ResponseBuilder.send(
      res,
      ResponseBuilder.success(
        result,
        "Password reset token is valid."
      )
    );
  }

  consume(req, res) {
    const { token } = req.body;

    const result = this.service.consume(token);

    if (!result.valid) {
      return ResponseBuilder.send(
        res,
        ResponseBuilder.error(
          400,
          result.reason,
          "Password reset token cannot be used."
        )
      );
    }

    return ResponseBuilder.send(
      res,
      ResponseBuilder.success(
        result,
        "Password reset token consumed."
      )
    );
  }

  revoke(req, res) {
    const { token } = req.params;

    const revoked = this.service.revoke(token);

    return ResponseBuilder.send(
      res,
      ResponseBuilder.success(
        { revoked },
        revoked
          ? "Password reset token revoked."
          : "Password reset token not found."
      )
    );
  }
}

module.exports = PasswordResetController;
