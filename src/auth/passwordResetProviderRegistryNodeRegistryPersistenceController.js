"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceService = require("./passwordResetProviderRegistryNodeRegistryPersistenceService");

class PasswordResetProviderRegistryNodeRegistryPersistenceController {
  constructor(options = {}) {
    this.service =
      options.service ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceService(options);
  }

  async save(req, res, next) {
    try {
      const result = this.service.save(req.body);

      return res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (next) {
        return next(error);
      }

      return res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async load(req, res, next) {
    try {
      const result = this.service.load();

      return res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (next) {
        return next(error);
      }

      return res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async backup(req, res, next) {
    try {
      const result = this.service.backup(req.body?.destinationPath);

      return res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (next) {
        return next(error);
      }

      return res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async restore(req, res, next) {
    try {
      const result = this.service.restore(req.body?.sourcePath);

      return res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (next) {
        return next(error);
      }

      return res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async remove(req, res, next) {
    try {
      const result = this.service.delete();

      return res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (next) {
        return next(error);
      }

      return res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  status() {
    return {
      controller:
        "PasswordResetProviderRegistryNodeRegistryPersistenceController",
      service: this.service.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceController;
