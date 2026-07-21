"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryService = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryService");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryController {
  constructor(options = {}) {
    this.service =
      options.service ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryService(
        options
      );
  }

  register(req, res, next) {
    try {
      const { name } = req.params;

      const registry = this.service.register(name, req.body);

      return res.status(201).json({
        success: true,
        data: registry,
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

  unregister(req, res, next) {
    try {
      const { name } = req.params;

      return res.status(200).json({
        success: true,
        data: this.service.unregister(name),
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

  get(req, res, next) {
    try {
      const { name } = req.params;

      return res.status(200).json({
        success: true,
        data: this.service.get(name),
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

  list(req, res, next) {
    try {
      return res.status(200).json({
        success: true,
        data: this.service.list(),
        count: this.service.count(),
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
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryController",
      service: this.service.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryController;
