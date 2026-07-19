"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryService = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryService");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryController {
  constructor(options = {}) {
    this.service =
      options.service ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryService(
        options
      );
  }

  save(req, res, next) {
    try {
      const { id } = req.params;
      const result = this.service.save(id, req.body || {});

      return res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return next ? next(error) : res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  update(req, res, next) {
    try {
      const { id } = req.params;
      const result = this.service.update(id, req.body || {});

      return res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return next ? next(error) : res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  findById(req, res, next) {
    try {
      const { id } = req.params;

      return res.status(200).json({
        success: true,
        data: this.service.findById(id),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return next ? next(error) : res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  findAll(req, res, next) {
    try {
      return res.status(200).json({
        success: true,
        data: this.service.findAll(),
        count: this.service.count(),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return next ? next(error) : res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  delete(req, res, next) {
    try {
      const { id } = req.params;

      return res.status(200).json({
        success: true,
        data: this.service.delete(id),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return next ? next(error) : res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  status() {
    return {
      controller:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryController",
      service: this.service.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryController;
