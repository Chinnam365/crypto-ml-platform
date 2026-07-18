"use strict";

const PasswordResetProviderRegistryNodeRegistryValidator = require("./passwordResetProviderRegistryNodeRegistryValidator");

class PasswordResetProviderRegistryNodeRegistryMiddleware {
  constructor(options = {}) {
    this.validator =
      options.validator ||
      new PasswordResetProviderRegistryNodeRegistryValidator(options);
  }

  validateConfiguration() {
    return (req, res, next) => {
      const result = this.validator.validate(req.body || {});

      if (!result.valid) {
        return res.status(400).json({
          success: false,
          message: "Invalid registry configuration.",
          errors: result.errors,
          timestamp: new Date().toISOString()
        });
      }

      next();
    };
  }

  validateRequest() {
    return (req, res, next) => {
      if (!req) {
        return res.status(400).json({
          success: false,
          message: "Invalid request.",
          timestamp: new Date().toISOString()
        });
      }

      next();
    };
  }

  handleErrors() {
    return (err, req, res, next) => {
      if (!err) {
        return next();
      }

      return res.status(err.status || 500).json({
        success: false,
        error: {
          name: err.name || "Error",
          message: err.message || "Internal Server Error"
        },
        timestamp: new Date().toISOString()
      });
    };
  }

  status() {
    return {
      middleware: "PasswordResetProviderRegistryNodeRegistryMiddleware",
      validator: this.validator.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeRegistryMiddleware;
